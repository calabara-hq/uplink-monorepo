import { NextRequest } from "next/server";
import { ImageResponse } from "next/og"
import fetchMintBoard from "@/lib/fetch/fetchMintBoard";
import { parseIpfsUrl } from "@/lib/ipfs"

export const runtime = 'edge'

export async function GET(req: NextRequest) {
  const name = req.nextUrl.pathname.split("/")[3];
  const mintboard = await fetchMintBoard(name);
  const posts = { mintboard }

  const ubuntuBold = fetch(
    new URL('@/styles/fonts/Ubuntu-Bold.ttf', import.meta.url)
  ).then((res) => res.arrayBuffer())

    
    // for each post, the optimized img can be constructed via parseIpfsUrl(post.edition.imageURI)
    



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
            width: "65%",
            background: "#121212"
          }}
        >
          <img
            src={mintboard.space.logoUrl}
            alt="logo"
            width="100%"
            height="100%"
            style={{ objectFit: "cover" }}
          />
          </div>

        <div
          style={{
            display: "flex",
            position: "absolute",
            left: 0,
            top: 0,
            flexDirection: "column",
            width: "100%",
            height: "100%",
            paddingLeft: "5px",
            justifyContent: "center",
            background: "#1c1f26",
            clipPath: "polygon(0% 0%, 75% 0%, 150% 100%, 0% 100%)",
          }}
        >
          <h1 
            style={{
              width: "100%",
              maxWidth: "50%",
              textAlign: "left",
              padding: "30px",
              fontSize: 36
            }}
          >
            Create with {mintboard.space.displayName}
          </h1>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 600,
      fonts: [
        {
          name: 'Ubuntu',
          data: await ubuntuBold,
          style: 'normal',
          weight: 400
        }
      ]
    }
  );
}