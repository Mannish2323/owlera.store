import { redirect } from "next/navigation";

// /track-order is an alias for /orders (the order tracking page)
export default function TrackOrderPage() {
  redirect("/orders");
}
