import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase-server";
import { createServiceClient, verifyAdmin } from "@/lib/admin-auth";
import { demoProducts } from "@/lib/products";

const ALLOWED_MIME_TYPES = ["image/jpeg", "image/png", "image/webp", "image/avif", "image/jpg"];
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB

export async function GET() {
  const auth = await verifyAdmin();
  if (!auth.authorized) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }

  const supabase = createClient();
  const serviceClient = createServiceClient() || supabase;

  let storageFiles: any[] = [];
  const bucketName = "product-images";

  if (serviceClient) {
    try {
      const { data: files, error } = await serviceClient.storage
        .from(bucketName)
        .list("products", { limit: 100, sortBy: { column: "created_at", order: "desc" } });

      if (!error && files) {
        // Collect URLs
        storageFiles = files.map((f: any) => {
          const { data: publicUrlData } = serviceClient.storage
            .from(bucketName)
            .getPublicUrl(`products/${f.name}`);
          return {
            name: f.name,
            id: f.id,
            size: f.metadata?.size || 0,
            mimetype: f.metadata?.mimetype || "image/jpeg",
            createdAt: f.created_at,
            url: publicUrlData?.publicUrl || ""
          };
        });
      }
    } catch (e) {
      console.warn("Could not list from storage bucket:", e);
    }
  }

  // If storage bucket is empty or not configured yet, provide media catalogue from products
  if (storageFiles.length === 0) {
    const fallbackImages = [
      {
        name: "celeste-gold-hoops.jpg",
        size: 245000,
        mimetype: "image/jpeg",
        createdAt: new Date().toISOString(),
        url: "https://images.unsplash.com/photo-1630019852942-f89202989a59?auto=format&fit=crop&w=900&q=85",
        usedIn: "Celeste Gold Hoops"
      },
      {
        name: "nocturne-solitaire-ring.jpg",
        size: 310000,
        mimetype: "image/jpeg",
        createdAt: new Date().toISOString(),
        url: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=900&q=85",
        usedIn: "Nocturne Solitaire Ring"
      },
      {
        name: "aurora-pendant-necklace.jpg",
        size: 198000,
        mimetype: "image/jpeg",
        createdAt: new Date().toISOString(),
        url: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=900&q=85",
        usedIn: "Aurora Pendant Necklace"
      },
      {
        name: "atelier-silk-twill-scarf.jpg",
        size: 420000,
        mimetype: "image/jpeg",
        createdAt: new Date().toISOString(),
        url: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=900&q=85",
        usedIn: "Atelier Silk Twill Scarf"
      },
      {
        name: "sanctuary-botanical-candle.jpg",
        size: 290000,
        mimetype: "image/jpeg",
        createdAt: new Date().toISOString(),
        url: "https://images.unsplash.com/photo-1603006905003-be475563bc59?auto=format&fit=crop&w=900&q=85",
        usedIn: "Sanctuary Botanical Candle"
      }
    ];

    return NextResponse.json({
      media: fallbackImages,
      source: "catalogue",
      bucket: bucketName
    });
  }

  return NextResponse.json({
    media: storageFiles,
    source: "supabase-storage",
    bucket: bucketName
  });
}

export async function POST(req: Request) {
  const auth = await verifyAdmin();
  if (!auth.authorized) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }

  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No image file provided in form data." }, { status: 400 });
    }

    // 1. Validate MIME type
    if (!ALLOWED_MIME_TYPES.includes(file.type.toLowerCase())) {
      return NextResponse.json(
        {
          error: `Invalid file type (${file.type}). Allowed image formats are JPEG, PNG, WebP, and AVIF.`
        },
        { status: 400 }
      );
    }

    // 2. Validate file size
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        {
          error: `File size exceeds the 5 MB limit (Received ${(file.size / (1024 * 1024)).toFixed(2)} MB).`
        },
        { status: 400 }
      );
    }

    // 3. Prepare sanitized file path
    const sanitizedOriginal = file.name.replace(/[^a-zA-Z0-9.-]/g, "_").toLowerCase();
    const timestamp = Date.now();
    const storagePath = `products/${timestamp}-${sanitizedOriginal}`;

    const supabase = createClient();
    const serviceClient = createServiceClient() || supabase;
    const bucketName = "product-images";

    if (serviceClient) {
      const buffer = Buffer.from(await file.arrayBuffer());

      // Attempt upload to Supabase Storage
      const { data: uploadData, error: uploadErr } = await serviceClient.storage
        .from(bucketName)
        .upload(storagePath, buffer, {
          contentType: file.type,
          upsert: true
        });

      if (!uploadErr && uploadData) {
        const { data: publicUrlData } = serviceClient.storage
          .from(bucketName)
          .getPublicUrl(storagePath);

        return NextResponse.json({
          success: true,
          url: publicUrlData.publicUrl,
          path: storagePath,
          size: file.size,
          mimetype: file.type,
          name: file.name
        });
      }

      // If bucket doesn't exist, try creating it or log descriptive error
      console.warn("Storage upload error:", uploadErr?.message);
    }

    // Fallback: If Supabase Storage bucket is not provisioned or returns error
    // In production without storage setup, return data URI or error
    return NextResponse.json({
      error: "Supabase Storage bucket 'product-images' is not configured or not accessible. Please ensure bucket exists and has public read access enabled."
    }, { status: 503 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Failed to process image upload." }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  const auth = await verifyAdmin();
  if (!auth.authorized) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }

  try {
    const { searchParams } = new URL(req.url);
    const path = searchParams.get("path");

    if (!path) {
      return NextResponse.json({ error: "Storage file path is required." }, { status: 400 });
    }

    const supabase = createClient();
    const serviceClient = createServiceClient() || supabase;
    const bucketName = "product-images";

    if (serviceClient) {
      // Check if image is in use by any product
      const { data: publicUrlData } = serviceClient.storage.from(bucketName).getPublicUrl(path);
      const publicUrl = publicUrlData?.publicUrl;

      if (publicUrl) {
        const { data: inUse } = await serviceClient
          .from("products")
          .select("id, name")
          .eq("image_url", publicUrl)
          .limit(1);

        if (inUse && inUse.length > 0) {
          return NextResponse.json(
            {
              error: `Cannot delete asset: In use by product "${inUse[0].name}". Replace image in product catalogue first.`
            },
            { status: 409 }
          );
        }
      }

      const { error } = await serviceClient.storage.from(bucketName).remove([path]);
      if (error) {
        return NextResponse.json({ error: error.message }, { status: 400 });
      }

      return NextResponse.json({ success: true, message: "Asset removed from storage." });
    }

    return NextResponse.json({ success: true, message: "Asset removed." });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Failed to delete asset." }, { status: 500 });
  }
}
