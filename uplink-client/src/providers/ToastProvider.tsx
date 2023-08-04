"use client";
import { ToastIcon, Toaster, resolveValue } from "react-hot-toast";
import { motion } from "framer-motion";

export default function ToastProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {children}
      <Toaster position="bottom-right">
        {(t) => (
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{
              opacity: t.visible ? 1 : 0,
              scale: t.visible ? 1 : 0.75,
            }}
            transition={{ duration: 0.15 }}
            className={`transform p-4 flex rounded-xl shadow-lg text-black
            ${t.type === "error" ? "bg-error" : "bg-info"}`}
          >
            <ToastIcon toast={t} />
            <p className="px-2">{resolveValue(t.message, t)}</p>
          </motion.div>
        )}
      </Toaster>
    </>
  );
}
