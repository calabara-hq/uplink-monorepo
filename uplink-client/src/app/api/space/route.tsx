import { NextRequest } from "next/server";
import { ImageResponse } from "next/og"
import fetchSingleSpace from "@/lib/fetch/fetchSingleSpace";

export const runtime = 'edge';

export async function GET(req: NextRequest) {

  const searchParams = req.nextUrl.searchParams;
  const name = searchParams.get('name');

  const space = await fetchSingleSpace(name);

  return new ImageResponse(
    (

      <div
        style={{
          fontSize: 36,
          width: 1200,
          height: 600,
          display: "flex",
          flexDirection: "column",
          textAlign: "center",
          alignItems: "center",
          justifyContent: "center",
        }}
      >

        <img
          src={`https://res.cloudinary.com/drrkx8iye/image/fetch/w_1200,q_auto,c_limit,f_auto/${space.logoUrl}`}
          alt="logo"
          width="100%"
          height="100%"
          style={{ objectFit: "cover" }}
        />

      </div>
    ),
    {
      width: 1200,
      height: 600,
    }
  );
}