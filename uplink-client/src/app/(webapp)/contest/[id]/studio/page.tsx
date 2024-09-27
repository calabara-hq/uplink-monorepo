import LoadingDialog from "./loadingDialog";
import dynamic from "next/dynamic";

const StandardSubmit = dynamic(() => import("./standardSubmit"), {
  ssr: false,
  loading: () => <LoadingDialog springUp />,
});

export default async function Page({
  params,
}: {
  params: { name: string; id: string };
}) {

  // contest in submit window
  return <StandardSubmit params={params} />;
}
