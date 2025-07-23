"use client";

import React, { forwardRef, useRef } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { AnimatedBeam } from "@/components/magicui/animated-beam";

import Next from "@/public/icons/nextjs.svg";
import Prisma from "@/public/icons/prisma.svg";
import Gemini from "@/public/icons/gemini.svg";
import mcp from "@/public/icons/mcp.svg";

const Circle = forwardRef<
  HTMLDivElement,
  { className?: string; children?: React.ReactNode }
>(({ className, children }, ref) => {
  return (
    <div
      ref={ref}
      className={cn(
        "z-10 flex size-16 items-center justify-center rounded-xl border-2 bg-white/98 dark:bg-zinc-800/98 p-4 shadow-xl transition-all duration-300 hover:scale-105 hover:shadow-[0_0_30px_-10px_rgba(0,0,0,0.6)]",
        className
      )}
    >
      {children}
    </div>
  );
});
Circle.displayName = "Circle";

export function AnimatedBeamDemo() {
  const containerRef = useRef<HTMLDivElement>(null);
  const nextRef = useRef<HTMLDivElement>(null);
  const mcpClientRef = useRef<HTMLDivElement>(null);
  const geminiRef = useRef<HTMLDivElement>(null);
  const mcpServerRef = useRef<HTMLDivElement>(null);
  const prismaRef = useRef<HTMLDivElement>(null);

  return (
    <div className="relative h-[500px] w-full flex justify-center items-center overflow-hidden">
      <div
        ref={containerRef}
        className="relative container  mx-auto h-full w-full max-w-6xl"
      >
        {/* Positioned nodes */}
        <div className="absolute z-50 left-[10%] top-[40%]">
          <Circle ref={nextRef}>
            <Image
              src={Next}
              width={32}
              height={32}
              alt="Next.js"
              className="dark:invert"
            />
          </Circle>
        </div>

        <div className="absolute z-50  left-[10%] top-[15%]">
          <Circle ref={mcpClientRef}>
            <Image
              src={mcp}
              width={32}
              height={32}
              alt="MCP Client"
              className="dark:invert"
            />
          </Circle>
        </div>

        <div className="absolute z-50  left-[70%] top-[15%]">
          <Circle ref={geminiRef}>
            <Image src={Gemini} width={32} height={32} alt="Gemini" />
          </Circle>
        </div>

        <div className="absolute z-50  left-[70%] top-[40%]">
          <Circle ref={mcpServerRef}>
            <Image
              src={mcp}
              width={32}
              height={32}
              alt="MCP Server"
              className="dark:invert"
            />
          </Circle>
        </div>

        <div className="absolute z-50  left-[40%] top-[60%]">
          <Circle ref={prismaRef}>
            <Image
              src={Prisma}
              width={32}
              height={32}
              alt="Prisma"
              className="dark:invert"
            />
          </Circle>
        </div>

        {/* Forward flow */}
        <AnimatedBeam
          containerRef={containerRef}
          fromRef={nextRef}
          toRef={mcpClientRef}
          curvature={60}
          endXOffset={20}
          
        />
        <AnimatedBeam
          containerRef={containerRef}
          fromRef={mcpClientRef}
          toRef={geminiRef}
          curvature={60}
        />
        <AnimatedBeam
          containerRef={containerRef}
          fromRef={geminiRef}
          toRef={mcpServerRef}
          curvature={60}
          endXOffset={20}
        />
        <AnimatedBeam
          containerRef={containerRef}
          fromRef={mcpServerRef}
          toRef={prismaRef}
          curvature={60}
        />
        <AnimatedBeam
          containerRef={containerRef}
          fromRef={nextRef}
          toRef={prismaRef}
          curvature={-80}
        />

        {/* Backward flow */}
        <AnimatedBeam
          containerRef={containerRef}
          fromRef={prismaRef}
          toRef={mcpServerRef}
          curvature={-60}
          reverse
        />
        <AnimatedBeam
          containerRef={containerRef}
          fromRef={mcpServerRef}
          toRef={geminiRef}
          curvature={-60}
          endXOffset={-20}
          reverse
        />
        <AnimatedBeam
          containerRef={containerRef}
          fromRef={geminiRef}
          toRef={mcpClientRef}
          curvature={-60}
          reverse
        />
        <AnimatedBeam
          containerRef={containerRef}
          fromRef={mcpClientRef}
          toRef={nextRef}
          curvature={-60}
          endXOffset={-20}
          reverse
        />
      </div>
    </div>
  );
}
