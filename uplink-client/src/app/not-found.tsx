"use client";
import { useRouter } from "next/navigation";
import loadingNoggles from "../../public/loading-noggles.svg";
import Link from "next/link";
import UplinkImage from "@/lib/UplinkImage";
import { Button } from "@/ui/DesignKit/Button";
export default function NotFound() {
  const router = useRouter();
  return (
    <div className="w-full h-[80vh] flex flex-col items-center justify-center gap-6">
      <div className="flex flex-col gap-6 items-center">
        <UplinkImage src={loadingNoggles} alt="404" />
        <h2 className="text-3xl text-t2">thats a 404</h2>
        <h2 className="text-xl text-t2 text-center">{`We couldn't find what you were looking for`}</h2>
        <div className="flex gap-6">
          <Link
            href="https://twitter.com/uplinkwtf"
            target="_blank"
            draggable={false}
            prefetch={false}
            passHref
          >
            <Button variant="outline">Contact Us</Button>
          </Link>

          <Button
            variant="default"
            onClick={() => router.back()}
          >
            Go Back
          </Button>
        </div>
      </div>
    </div>
  );
}