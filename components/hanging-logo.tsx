"use client";

import React from "react";
import { OwlEmblem } from "./owl-emblem";

interface HangingLogoProps {
  className?: string;
}

export function HangingLogo({ className = "" }: HangingLogoProps) {
  return (
    <div
      className={`suspended-logo-container ${className}`}
      aria-label="OWLERA Suspended Wordmark"
    >
      {/* Top suspension ceiling mount pins */}
      <div className="suspension-mount-bar">
        <div className="mount-pin" title="Suspension anchor" />
        <div className="mount-pin" title="Suspension anchor" />
      </div>

      {/* Two fine gold link chains */}
      <div className="suspension-chains">
        <div className="chain-line" />
        <div className="chain-line" />
      </div>

      {/* Unified Suspended Pendant Assembly: Physically attached to the chains */}
      <div className="suspended-wordmark-wrap">
        {/* Horizontal gold balance rod with eyelet rings where the chains anchor */}
        <div className="suspension-crossbar">
          <div className="crossbar-anchor left" />
          <div className="crossbar-rod" />
          <div className="crossbar-anchor right" />
        </div>

        {/* The Approved Monoline Diamond Owl Emblem */}
        <div className="suspended-emblem-container">
          <OwlEmblem size={52} color="#C6A45B" secondaryColor="#123D2E" />
        </div>

        {/* The OWLERA luxury serif wordmark */}
        <h1 className="suspended-owlera-name">OWLERA</h1>
        <span className="suspended-subtitle">Your Everyday Shine</span>
      </div>
    </div>
  );
}
