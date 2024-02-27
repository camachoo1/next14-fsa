"use client";

import { useState, useEffect } from "react";
import AccountInformation from "./AccountInformation";
import OrderHistory from "./OrderHistory";
import Wishlist from "./Wishlist";
import { useSearchParams } from "next/navigation";

const DynamicContent = () => {
  const [view, setView] = useState("");
  const searchParams = useSearchParams();

  useEffect(() => {
    const sp = new URLSearchParams(window.location.search);

    const vp = sp.get("view");

    if (vp) {
      setView(vp);
    }
  }, [searchParams]);

  let content;

  switch (view) {
    case "edit":
      content = <AccountInformation />;
      break;
    case "order-history":
      content = <OrderHistory />;
      break;
    case "wishlist":
      content = <Wishlist />;
      break;
    default:
      content = <OrderHistory />;
  }

  return <>{content}</>;
};

export default DynamicContent;
