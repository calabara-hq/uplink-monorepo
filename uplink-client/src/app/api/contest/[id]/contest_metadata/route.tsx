import { NextRequest } from "next/server";
import { ImageResponse } from "next/og"
import fetchContest from "@/lib/fetch/fetchContest";

export const runtime = 'edge'

export async function GET(req: NextRequest) {
  const contestId = req.nextUrl.pathname.split("/")[3];
  const contest = await fetchContest(contestId).then(async (res) => {
    const promptData = await fetch(res.promptUrl).then((res) => res.json());
    return { ...res, prompt: promptData };
  });


  const RenderPreview = () => {
    const preview_image = contest?.prompt?.coverUrl ?? null
    if(preview_image){
      return (
        <img
            src={preview_image}
            alt="logo"
            width="100%"
            height="100%"
            style={{ objectFit: "cover" }}
          />      
        )
    }
    return null;
  }
  
  // const ubuntuBold = fetch(
  //   new URL('@/styles/fonts/Ubuntu-Bold.ttf', import.meta.url)
  // ).then((res) => res.arrayBuffer())

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
          <RenderPreview/>
        </div>

        <div
          style={{
            display: "flex",
            position: "absolute",
            left: 0,
            top: 0,
            flexDirection: "column",
            gap: '0px',
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
              padding: "30px",
              maxWidth: "50%",
              textAlign: "left",
              fontSize: 36
            }}
          >
            {contest.prompt.title}
          </h1>
          
          {/* <div 
            style={{
                display: "flex",
                alignItems: "center",
                gap: '10px'
            }}
          >
            <img
                src={contest.space.logoUrl}
                alt="logo"
                width="40px"
                height="40px"
                style={{ objectFit: "contain", borderRadius: "100%" }}
            /> 
            <p
                style={{
                    fontSize: 20,
                    color: "gray"
                }}
            >
                {contest.space.displayName}
            </p>
          </div> */}
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 600,
      // fonts: [
      //   {
      //     name: 'Ubuntu',
      //     data: await ubuntuBold,
      //     style: 'normal',
      //     weight: 400
      //   }
      // ]
    }
  );
}
