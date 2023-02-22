import DynamicLink from "@/ui/TestButton/TestButton";
import TestButton from "@/ui/TestButton/TestButton";
import Link from "next/link";

export default function Page() {
  return (
    <div>
      <p>hello from route 1</p>
      <Link className="btn" href="/route2">
        go to route 2
      </Link>
      <DynamicLink href="/route2">an alternate path</DynamicLink>
    </div>
  );
}
