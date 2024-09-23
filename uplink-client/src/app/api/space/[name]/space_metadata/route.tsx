import { NextRequest } from "next/server";
import { ImageResponse } from "next/og"
import fetchSingleSpace from "@/lib/fetch/fetchSingleSpace";

export const runtime = 'edge'

export async function GET(req: NextRequest) {
  const name = req.nextUrl.pathname.split("/")[3];
  const space = await fetchSingleSpace(name);

  const ubuntuBold = fetch(
    new URL('@/styles/fonts/Ubuntu-Bold.ttf', import.meta.url)
  ).then((res) => res.arrayBuffer())

  return new ImageResponse(
    (

      <div
        style={{
          fontSize: 36,
          //background: "black",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          textAlign: "center",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
          color: "white",

        }}
      >
        <img
          src={'http://localhost:3000/opengraph.png'}
          alt="logo"
          width="100%"
          height="100%"
          style={{ objectFit: "cover" }}
        />
        <div style={{
          position: "absolute",
          display: "flex",
          width: "100px",
          height: "100px",
          left: 16,
          top: 16,
        }}>
          <img
            src={space.logoUrl}
            alt="logo"
            style={{ objectFit: "cover" }}
          />
        </div>
      </div>

      // <img
      //   src={'http://localhost:3000/opengraph.png'}
      //   alt="logo"
      //   width="100%"
      //   height="100%"
      //   style={{ objectFit: "cover" }}
      // />


      // <div
      //   style={{
      //     fontSize: 36,
      //     background: "transparent",
      //     width: "100%",
      //     height: "100%",
      //     display: "flex",
      //     textAlign: "center",
      //     alignItems: "center",
      //     justifyContent: "center",
      //     position: "relative",
      //     color: "white",
      //   }}
      // >
      //   <div
      //     style={{
      //       position: "absolute",
      //       display: "flex",
      //       right: 0,
      //       top: 0,
      //       height: "100%",
      //       width: "65%",
      //       background: "#121212"
      //     }}
      //   >
      //     <img
      //       src={space.logoUrl}
      //       alt="logo"
      //       width="100%"
      //       height="100%"
      //       style={{ objectFit: "cover" }}
      //     />
      //     </div>

      //   <div
      //     style={{
      //       display: "flex",
      //       position: "absolute",
      //       left: 0,
      //       top: 0,
      //       flexDirection: "column",
      //       width: "100%",
      //       height: "100%",
      //       paddingLeft: "5px",
      //       justifyContent: "center",
      //       background: "#1c1f26",
      //       clipPath: "polygon(0% 0%, 75% 0%, 150% 100%, 0% 100%)",
      //     }}
      //   >
      //     <h1 
      //       style={{
      //         width: "100%",
      //         maxWidth: "50%",
      //         textAlign: "left",
      //         padding: "30px",
      //         fontSize: 36
      //       }}
      //     >
      //       Create with {space.displayName}
      //     </h1>
      //   </div>
      // </div>
    ),
    {
      width: 1024,
      height: 590,
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