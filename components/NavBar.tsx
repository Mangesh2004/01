'use client'
import React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"
import Link from "next/link"

const navItems = [
    {
        name: "Home",
        link: "/"
      },

  {
    name: "Modal Answer",
    link: "/ModalAnswer"
  },
  {
    name: "Upload PDF",
    link: "/upload-pdf"
  },
  {
    name: "Evaluate",
    link: "/Evaluation"
  }
]

export const NavBar = ({ className }: { className?: string }) => {
  return (
    <AnimatePresence mode="wait">
      <motion.div
        initial={{
          opacity: 1,
          y: -100,
        }}
        animate={{
          y: 0,
          opacity: 1,
        }}
        transition={{
          duration: 0.2,
        }}
        className={cn(
          "flex max-w-fit fixed top-5 inset-x-0 mx-auto border border-zinc-700 rounded-full bg-zinc-900/90 backdrop-blur-md shadow-[0px_2px_3px_-1px_rgba(0,0,0,0.3)] z-[5000] px-8 py-2 items-center justify-center space-x-4",
          className
        )}
      >
        {navItems.map((navItem, idx) => (
          <Link
            key={`link-${idx}`}
            href={navItem.link}
            className={cn(
              "relative text-white items-center flex space-x-1 hover:text-black hover:bg-white px-3 py-1 rounded-full transition-all duration-200"
            )}
          >
            <span className="text-sm">{navItem.name}</span>
          </Link>
        ))}
      </motion.div>
    </AnimatePresence>
  )
}
