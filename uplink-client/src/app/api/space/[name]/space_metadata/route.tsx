import { NextRequest } from "next/server";
import { ImageResponse } from "next/og"
import fetchSingleSpace from "@/lib/fetch/fetchSingleSpace";

export const runtime = 'edge'

export async function GET(req: NextRequest) {
  const name = req.nextUrl.pathname.split("/")[3];
  const space = await fetchSingleSpace(name);

  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 36,
          background: "#232225",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          textAlign: "center",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
          color: "#232225",

        }}
      >
        <img
          src={space.logoUrl}
          alt="logo"
          width="100%"
          height="100%"
          style={{ objectFit: "cover" }}
        />
        {/* </div> */}
      </div>
    ),
    {
      width: 1200,
      height: 630
    }
  );
}