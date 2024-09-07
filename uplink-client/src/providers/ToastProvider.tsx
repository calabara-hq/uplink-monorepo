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
            className={`animate-springUp transform p-4 flex rounded-xl shadow-lg border bg-base-100 border-border text-t1`}>
            <ToastIcon toast={t} />
            <p className="px-2">{resolveValue(t.message, t)}</p>
          </div>
        )}
      </Toaster>
    </>
  );
}
