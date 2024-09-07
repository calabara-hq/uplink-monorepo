"use client";
import { Button } from "@/ui/DesignKit/Button";
import { useRouter } from "next/navigation";

export default function Error({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  const router = useRouter();
  return (
    <div className="w-full h-[60vh] bg-base flex flex-col gap-4 items-center justify-center">
      <p className="text-t1 text-3xl">There was a problem</p>
      <p className="text-t2 text-xl">
        Please try again later or send us a DM on{" "}
        <a
          className="text-blue-600"
          href="https://twitter.com/uplinkwtf"
          target="_blank"
        >
          Twitter
        </a>
      </p>
      <div className="flex gap-8">
        <Button variant="outline" onClick={() => router.back()}>Go back</Button>
        <Button variant="default" onClick={reset}>Try again</Button>
      </div>
    </div>
  );
}
