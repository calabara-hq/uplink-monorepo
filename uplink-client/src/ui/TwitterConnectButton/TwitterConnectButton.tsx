"use client";
import { twitterSignIn, useSession } from "@/providers/SessionProvider";
import Image from "next/image";

const TwitterConnectButton = ({}) => {
  const { data: session, status } = useSession();
  const handleClick = async () => {
    const res = await twitterSignIn("write");
    if (res) {
      window.open(res.url, "_blank");
    }
  };

  return (
    <div>
      <button className="btn bg-twitter" onClick={handleClick}>
        Twitter
      </button>
      <div>
        <p>Twitter</p>
        {session?.user?.twitter?.name}
        {session?.user?.twitter?.profile_image_url && (
          <Image
            className="rounded-full"
            width={50}
            height={50}
            src={session?.user?.twitter?.profile_image_url}
            alt={"weekly sub"}
          />
        )}
      </div>
    </div>
  );
};

export default TwitterConnectButton;
