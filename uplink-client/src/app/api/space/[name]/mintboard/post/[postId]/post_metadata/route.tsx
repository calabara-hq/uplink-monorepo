import { NextRequest } from "next/server";
import { ImageResponse } from "next/og"
import fetchMintBoard from "@/lib/fetch/fetchMintBoard";
import { parseIpfsUrl } from "@/lib/ipfs";
import { fetchSingleMintboardPost } from "@/lib/fetch/fetchMintBoardPosts";

export const runtime = 'edge'

export async function GET(req: NextRequest) {
  const name = req.nextUrl.pathname.split("/")[3];
  const postId = req.nextUrl.pathname.split("/")[6];
  const post = await fetchSingleMintboardPost(name, postId);
  const previewImage = parseIpfsUrl(post.edition.imageURI).gateway;

  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 36,
          background: "transparent",
          width: "100%",
          height: "100%",
          display: "flex",
          textAlign: "center",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
          color: "white",
        }}
      >
        <div
          style={{
            position: "absolute",
            display: "flex",
            right: 0,
            top: 0,
            height: "100%",
            width: "100%",
            background: "#121212"
          }}
        >
          <img
            src={previewImage}
            alt="logo"
            width="100%"
            height="100%"
            style={{ objectFit: "cover" }}
          /> 
        </div>

      </div>
    ),
    {
      width: 1200,
      height: 600,
    }
  );
}

