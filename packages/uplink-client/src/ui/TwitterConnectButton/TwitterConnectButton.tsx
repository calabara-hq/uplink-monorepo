"use client";
import { twitterSignIn, useSession } from "@/providers/SessionProvider";
import Image from "next/image";

const TwitterConnectButton = ({}) => {
  const { data: session, status } = useSession();
  const handleClick = async () => {
    //const res = await twitterSignIn("read");
    //if (res) {
      window.open("https://twitter.com/i/oauth2/authorize?response_type=code&client_id=MVNjMmR2Q0xWX3lITkltb1FsOFo6MTpjaQ&redirect_uri=https%3A%2F%2Flocalhost%3A443%2Fapi%2Fauth%2Ftwitter%2Foauth2&state=8Sltb.u_Zg1DMLb-8PvlLZS701qtdiJ9&code_challenge=IrD3fEQ9_f9lwkNaheWNUdLArXC1TAQMLzcs5lbCsTc&code_challenge_method=s256&scope=tweet.read%20users.read", "_blank");
    //}
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
