"use client";
import "../app/globals.css";
export default function Loader() {
  return (
    <div className="flex  flex-col gap-20   items-center justify-center   top-0 left-1/2 h-[500px] w-full ">
      <svg className="loader w-12 h-12 text-indigo-600" viewBox="25 25 50 50">
        <circle
          className="path"
          cx="50"
          cy="50"
          r="20"
          fill="none"
          stroke="currentColor"
          strokeWidth="4"
        />
      </svg>
    </div>
  );
}
