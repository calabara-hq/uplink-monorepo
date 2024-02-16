import { NextRequest, NextResponse } from "next/server";
import fetchMintBoard from "@/lib/fetch/fetchMintBoard";
import { parseIpfsUrl } from "@/lib/ipfs";
import { parse } from "url";

let postsArray = [];
let currentIndex = 0;
let totalCount = 0;
let currentPost;

export async function POST(req: NextRequest) {
  // try {
  //   const body = await req.json();
  //   const buttonIndex = body.untrustedData.buttonIndex;
  //   const name = req.nextUrl.pathname.split("/")[3];
  //   const mintBoard = await fetchMintBoard(name);

  //   postsArray = [...mintBoard.posts];
  //   postsArray = postsArray.reverse();

  //   totalCount = postsArray.length;

  //   if (buttonIndex === 1) {
  //     currentIndex = getPreviousIndex(postsArray, currentIndex);
  //   } else if (buttonIndex === 2) {
  //     currentIndex = getNextIndex(postsArray, currentIndex);
  //   } else if (buttonIndex === 3) {
  //     currentIndex = totalCount - 1;
  //   } else {
  //     currentIndex = findIndexWithHighestTotalMints(postsArray);
  //   }

  //   currentPost = postsArray[currentIndex];

  //   return new NextResponse(
  //     `
  //           <!DOCTYPE html>
  //           <html>
  //           <head>
  //               <meta name="fc:frame" content="vNext"/>
  //               <meta name="fc:frame:image" content="${String(
  //                 parseIpfsUrl(currentPost.edition.imageURI).gateway
  //               )}"/>
  //             <meta name="fc:frame:button:1" content="⬅️">
  //             <meta name="fc:frame:button:2" content="➡️">
  //             <meta name="fc:frame:button:3" content="Latest">
  //             <meta name="fc:frame:button:4" content="Popular">
  //             <meta name="fc:frame:post_url" content="${
  //               process.env.NEXT_PUBLIC_CLIENT_URL
  //             }/api/space/${name}/mintboard/mintboard_metadata/farcaster_frame_handler">
  //           </head>
  //           </html>
  //         `,
  //     { status: 200 }
  //   );
  // } catch (e) {
  //   console.error(e);
  //   return NextResponse.json({ status: 500 });
  // }
}

// helpers
function findIndexWithHighestTotalMints(postsArray) {
  if (!Array.isArray(postsArray) || postsArray.length === 0) {
    return -1; // return -1 if the data is not an array or is empty
  }

  let maxMints = 0;
  let indexWithMaxMints = -1;

  for (let i = 0; i < postsArray.length; i++) {
    const totalMints = parseInt(postsArray[i].totalMints, 10);
    if (totalMints > maxMints) {
      maxMints = totalMints;
      indexWithMaxMints = i;
    }
  }

  return indexWithMaxMints;
}

function getNextIndex(postsArray, currentIndex) {
  if (!Array.isArray(postsArray) || postsArray.length === 0) {
    return -1; // return -1 if the array is not valid or is empty
  }

  // Check if currentIndex is valid
  if (currentIndex < 0 || currentIndex >= postsArray.length) {
    return 0;
  }

  const nextIndex = currentIndex + 1;

  // Check if nextIndex exceeds the array length
  if (nextIndex >= postsArray.length) {
    return 0; // or return 0 to loop back to the first element
  }

  return nextIndex;
}

function getPreviousIndex(postsArray, currentIndex) {
  if (!Array.isArray(postsArray) || postsArray.length === 0) {
    return -1; // return -1 if the array is not valid or is empty
  }

  // Check if currentIndex is valid
  if (currentIndex < 0 || currentIndex >= postsArray.length) {
    return postsArray.length - 1;
  }

  const previousIndex = currentIndex - 1;

  // Check if previousIndex is before the start of the array
  if (previousIndex < 0) {
    return 0; // or return array.length - 1 to loop back to the last element
  }

  return previousIndex;
}
