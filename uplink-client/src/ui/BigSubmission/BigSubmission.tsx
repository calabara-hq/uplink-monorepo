import Output from "editorjs-react-renderer";
import Image from "next/image";
import {
  MediaController,
  MediaControlBar,
  MediaTimeRange,
  MediaTimeDisplay,
  MediaPlayButton,
  MediaMuteButton,
} from "media-chrome/dist/react";

const BigSubmission = ({ submission }: { submission: any }) => {
  if (submission.type === "text") {
    return <RenderBigTextSubmission submission={submission} />;
  }
  if (submission.type === "image") {
    return <RenderBigImageSubmission submission={submission} />;
  }
  if (submission.type === "video") {
    return <RenderBigVideoSubmission submission={submission} />;
  }

  return null;
};

const RenderBigTextSubmission = ({ submission }: { submission: any }) => {
  return (
    <div className="card-body h-64 bg-white/90 rounded-xl text-black/80 gap-1 w-full overflow-auto">
      <h2 className="break-all font-bold text-2xl">{submission.title}</h2>
      <h3 className="break-all italic">{submission.author}</h3>
      <section className="break-all">
        <Output data={submission.body} />
      </section>
    </div>
  );
};

const RenderBigImageSubmission = ({ submission }: { submission: any }) => {
  return (
    <figure className="relative h-full w-full">
      <Image
        src={submission.previewAsset}
        alt="submission image"
        fill
        className="rounded-t-xl object-contain w-full"
      />
    </figure>
  );
};

const RenderBigVideoSubmission = ({ submission }: { submission: any }) => {
  return (
    <MediaController className="aspect-video-16:9">
      <video
        slot="media"
        src={submission.videoAsset}
        poster={submission.previewAsset}
        preload="auto"
        muted
        crossOrigin=""
        className="rounded-t-xl w-full object-cover"
      />
      <MediaControlBar>
        <MediaPlayButton></MediaPlayButton>
        <MediaTimeRange></MediaTimeRange>
        <MediaTimeDisplay showDuration></MediaTimeDisplay>
        <MediaMuteButton></MediaMuteButton>
      </MediaControlBar>
    </MediaController>
  );
};

export default BigSubmission;
