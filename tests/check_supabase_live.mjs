async function checkSupabaseLive() {
  const base = 'https://owlera-store.vercel.app';
  console.log('--- Verifying Vercel & Supabase Live Integration ---');

  // 1. Fetch homepage HTML and find script bundles
  const res = await fetch(base + '/');
  const html = await res.text();
  const scriptRegex = /src="(\/_next\/static\/chunks\/[^"]+)"/g;
  let match;
  const scripts = [];
  while ((match = scriptRegex.exec(html)) !== null) {
    scripts.push(match[1]);
  }
  console.log('1. Located Next.js client chunks:', scripts.length);

  let supabaseUrl = null;
  for (const src of scripts) {
    const sRes = await fetch(base + src);
    const code = await sRes.text();
    const urlMatch = code.match(/https:\/\/[a-z0-9_-]+\.supabase\.co/);
    if (urlMatch) {
      supabaseUrl = urlMatch[0];
      console.log('2. Detected client-side Supabase project endpoint:', supabaseUrl);
      break;
    }
  }

  if (!supabaseUrl) {
    // Check if it's on the login page
    const loginRes = await fetch(base + '/auth/login');
    const loginHtml = await loginRes.text();
    const loginScripts = [];
    while ((match = scriptRegex.exec(loginHtml)) !== null) {
      loginScripts.push(match[1]);
    }
    for (const src of loginScripts) {
      const sRes = await fetch(base + src);
      const code = await sRes.text();
      const urlMatch = code.match(/https:\/\/[a-z0-9_-]+\.supabase\.co/);
      if (urlMatch) {
        supabaseUrl = urlMatch[0];
        console.log('2. Detected Supabase URL in auth chunk:', supabaseUrl);
        break;
      }
    }
  }

  // 3. Test API Admin Auth
  const authRes = await fetch(base + '/api/admin/auth');
  const authData = await authRes.json();
  console.log('3. Admin Auth Endpoint status:', authRes.status);
  console.log('   Response payload:', authData);

  // 4. Test Orders Track API
  const trackRes = await fetch(base + '/api/orders/track', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ trackingNumber: 'OWL-9999-TEST' })
  });
  console.log('4. Orders Track Endpoint status:', trackRes.status);
  if (trackRes.status !== 405) {
    const trackData = await trackRes.json();
    console.log('   Response payload:', trackData);
  }

  // 5. Test Coupons Validation API (POST or GET)
  const couponPostRes = await fetch(base + '/api/coupons/validate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ code: 'OWLFIRST10', total: 1999 })
  });
  console.log('5. Coupons Validate POST status:', couponPostRes.status);
  const couponData = await couponPostRes.json();
  console.log('   Coupon response:', couponData);

  // 6. Extract Anon Key from auth chunk and test Supabase tables directly
  let anonKey = null;
  const loginRes = await fetch(base + '/auth/login');
  const loginHtml = await loginRes.text();
  const loginScripts = [];
  while ((match = scriptRegex.exec(loginHtml)) !== null) {
    loginScripts.push(match[1]);
  }
  for (const src of loginScripts) {
    const sRes = await fetch(base + src);
    const code = await sRes.text();
    const keyMatch = code.match(/eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9\.[a-zA-Z0-9_-]+\.[a-zA-Z0-9_-]+/);
    if (keyMatch) {
      anonKey = keyMatch[0];
      break;
    }
  }

  if (anonKey && supabaseUrl) {
    console.log('6. Anon Key successfully extracted from Vercel client bundle!');
    const tables = ['products', 'categories', 'orders', 'coupons', 'admin_users', 'profiles'];
    for (const table of tables) {
      try {
        const tRes = await fetch(`${supabaseUrl}/rest/v1/${table}?select=*&limit=1`, {
          headers: {
            'apikey': anonKey,
            'Authorization': `Bearer ${anonKey}`
          }
        });
        const countHeader = tRes.headers.get('content-range') || 'N/A';
        if (tRes.status === 200) {
          const rows = await tRes.json();
          console.log(`   ✓ Table '${table}': Accessible (HTTP 200), Sample count: ${rows.length}`);
        } else {
          const errText = await tRes.text();
          console.log(`   ⚠ Table '${table}': HTTP ${tRes.status} (${errText.slice(0, 100)})`);
        }
      } catch (e) {
        console.log(`   ✕ Table '${table}': Fetch error: ${e.message}`);
      }
    }

    // 7. Check Auth service endpoint
    try {
      const authSettingRes = await fetch(`${supabaseUrl}/auth/v1/settings`, {
        headers: { 'apikey': anonKey }
      });
      console.log('7. Supabase Auth Service Health:', authSettingRes.status === 200 ? 'ONLINE (200 OK)' : `HTTP ${authSettingRes.status}`);
    } catch (e) {
      console.log('7. Supabase Auth Service error:', e.message);
    }
  } else {
    console.log('6. Anon Key could not be extracted directly (or env vars not baked into client build).');
  }

  console.log('--- Verification Complete ---');
}

checkSupabaseLive().catch(err => {
  console.error('Check failed:', err);
});
