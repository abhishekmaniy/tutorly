import Checkout from "@/components/checkoutPage/checkout";
import { Suspense } from "react";

export default function CheckoutPage() {
  return (
    <Suspense fallback={<div>Loading checkout...</div>}>
      <Checkout />
    </Suspense>
  );
}
