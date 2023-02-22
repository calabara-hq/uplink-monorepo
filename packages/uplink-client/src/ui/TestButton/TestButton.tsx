"use client";

import { useRouter } from "next/navigation";

export default function DynamicLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  const router = useRouter();

  return (
    <a
      href={href}
      onClick={(e) => {
        e.preventDefault();
        router.push(href);
        router.refresh();
      }}
    >
      {children}
    </a>
  );
}
