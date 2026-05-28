import React from "react";
import { motion, AnimatePresence } from "framer-motion";

/**
 * CommonDialog
 * Props:
 * - open: boolean
 * - onClose: () => void
 * - title: string
 * - fullScreen?: boolean
 * - backdropBlur?: boolean
 * - children: React.ReactNode
 */
export default function Dialog({ open, onClose, title, fullScreen = false, backdropBlur = false, children }) {
  const isMobile = typeof window !== "undefined" && window.innerWidth < 640;

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className={`fixed inset-0 z-50 flex items-center justify-center ${backdropBlur ? 'backdrop-blur-md' : ''} bg-black/40 p-4 print:static print:bg-transparent print:p-0 print:block`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            initial={isMobile ? { y: 40, opacity: 0 } : { x: 50, opacity: 0 }}
            animate={isMobile ? { y: 0, opacity: 1 } : { x: 0, opacity: 1 }}
            exit={isMobile ? { y: 40, opacity: 0 } : { x: 50, opacity: 0 }}
            className={`bg-white rounded-2xl shadow-xl w-full ${fullScreen ? "max-w-none h-full" : "max-w-lg"} flex flex-col print:rounded-none print:shadow-none print:h-auto print:max-h-none`}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b print:hidden">
              <h2 className="text-lg font-semibold">{title}</h2>
              <button
                onClick={onClose}
                className="text-gray-500 hover:text-black transition"
              >
                ✕
              </button>
            </div>

            {/* Body */}
            <div className="p-4 overflow-auto flex-1 print:overflow-visible print:flex-none">{children}</div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}