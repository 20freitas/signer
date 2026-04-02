"use client";

import React from "react";
import { motion } from "framer-motion";
import Image from "next/image";

export interface Testimonial {
    text: string;
    image: string;
    name: string;
    role: string;
}

export const TestimonialsColumn = (props: {
  className?: string;
  testimonials: Testimonial[];
  duration?: number;
}) => {
  return (
    <div className={props.className}>
      <motion.div
        animate={{
          translateY: "-50%",
        }}
        transition={{
          duration: props.duration || 10,
          repeat: Infinity,
          ease: "linear",
          repeatType: "loop",
        }}
        className="flex flex-col gap-6 pb-6"
      >
        {[
          ...new Array(2).fill(0).map((_, index) => (
            <React.Fragment key={index}>
              {props.testimonials.map(({ text, image, name, role }, i) => (
                <div 
                    className="p-10 rounded-[32px] border border-black/5 bg-white shadow-xl shadow-primary/5 max-w-xs w-full transition-all duration-300 hover:border-primary/10 hover:shadow-primary/10" 
                    key={i}
                >
                  <p className="text-text-secondary font-medium leading-relaxed italic">&quot;{text}&quot;</p>
                  <div className="flex items-center gap-3 mt-6">
                    <Image
                      width={40}
                      height={40}
                      src={image}
                      alt={name}
                      className="h-10 w-10 rounded-full object-cover grayscale hover:grayscale-0 transition-all duration-500 ring-2 ring-transparent hover:ring-primary/20"
                    />
                    <div className="flex flex-col">
                      <div className="font-black tracking-tight leading-none text-text-primary text-sm">{name}</div>
                      <div className="text-[10px] font-black uppercase tracking-widest text-primary/60 mt-1">{role}</div>
                    </div>
                  </div>
                </div>
              ))}
            </React.Fragment>
          )),
        ]}
      </motion.div>
    </div>
  );
};
