"use client"

import { useTheme } from "next-themes"
import { useEffect, useState } from "react"
import { Sun, Moon } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

export function ThemeSwitch() {
  const { resolvedTheme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  const isDark = resolvedTheme === "dark"

  const toggleTheme = () => {
    setTheme(isDark ? "light" : "dark")
  }

  return (
    <button
      onClick={toggleTheme}
      className="relative flex h-9 w-18 items-center justify-between rounded-full bg-muted px-2 shadow-inner transition-colors duration-300 dark:bg-zinc-700"
    >
      {/* Ícones fixos nas bordas */}
      <Sun className="h-5 w-5 text-yellow-400" />
      <Moon className="h-5 w-5 text-blue-400" />

      {/* Alavanca com animação */}
      <motion.div
        layout
        transition={{ type: "spring", stiffness: 500, damping: 30 }}
        className={`absolute inset-1  h-7 w-7 rounded-full bg-white shadow-md flex items-center justify-center`}
        animate={{
          x: isDark ? 36 : 0,
        }}
      >
        <AnimatePresence mode="wait" initial={false}>
          {isDark ? (
            <motion.div
              key="moon"
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.5 }}
              transition={{ duration: 0.3 }}
            >
              <Moon className="h-4 w-4 text-primary" />
            </motion.div>
          ) : (
            <motion.div
              key="sun"
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.5 }}
              transition={{ duration: 0.3 }}
            >
              <Sun className="h-4 w-4 text-yellow-600" />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </button>
  )
}
