"use client";

import { useEffect } from "react";

import { captureInitialMarketingAttribution } from "@/lib/marketingAttribution";

export function MarketingAttributionCapture() {
  useEffect(() => {
    captureInitialMarketingAttribution();
  }, []);

  return null;
}

