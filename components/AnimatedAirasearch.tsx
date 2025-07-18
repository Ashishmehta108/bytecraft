"use client";

import { useEffect, useState } from "react";
import { TextAnimate } from "./magicui/text-animate";
import { AnimatePresence, motion } from "framer-motion";

export function AnimatedAirasearch() {
  const data = ["Chairs", "Sofas", "Almirah", "Beds", "Cushions", "Lamps"];
  const [index, setIndex] = useState(0);
  const [show, setShow] = useState(data[0]);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % data.length);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    setShow(data[index]);
  }, [index]);

  return (
    <div className="flex gap-2 items-center text-sm text-zinc-300 font-normal">
      Search for{" "}
      <AnimatePresence mode="wait">
        <motion.div
          key={show}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.5 }}
        >
          <TextAnimate
            by="text" // or "word", "text"
            animation="blurInUp"
            duration={0.6}
          >
            {show}
          </TextAnimate>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
