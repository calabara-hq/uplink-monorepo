import { NextRequest } from "next/server";
import { ImageResponse } from "next/og"
import fetchSingleSubmission from "@/lib/fetch/fetchSingleSubmission";
import { isTwitterSubmission } from "@/types/submission";

export async function GET(req: NextRequest) {
  const submissionId = req.nextUrl.pathname.split("/")[3];
  const submission = await fetchSingleSubmission(submissionId)

  const calculatePreview = () => {
    if (submission.data.type === 'image') {
      if (isTwitterSubmission(submission)) {
        return submission.data.thread[0].previewAsset
      }
      return submission.data.previewAsset
    }
    return null;
  }


  const RenderPreview = () => {
    const preview_image = calculatePreview();
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
  
  const ubuntuBold = fetch(
    new URL('@/styles/fonts/Ubuntu-Bold.ttf', import.meta.url)
  ).then((res) => res.arrayBuffer())

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
            {submission.data.title}
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
