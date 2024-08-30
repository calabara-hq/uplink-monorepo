"use client";
import { ToastIcon, Toaster, resolveValue } from "react-hot-toast";

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
          <div
            className={`animate-springUp transform p-4 flex rounded-xl shadow-lg border border-border text-t1
            ${t.type === "error" ? "bg-error" : "bg-base-100"}`}
          >
            <ToastIcon toast={t} />
            <p className="px-2">{resolveValue(t.message, t)}</p>
          </div>
        )}
      </Toaster>
    </>
  );
}
