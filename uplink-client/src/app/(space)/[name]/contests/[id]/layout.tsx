import ContestSidebar from "@/ui/Contests/ContestSidebar";
import { ContestInteractionProvider } from "@/providers/ContestState";

export default function Layout({
  children,
  dynamicSidebar,
  params,
}: {
  children: React.ReactNode;
  dynamicSidebar: React.ReactNode;
  params: { name: string; id: string };
}) {
  return (
    <div className="m-auto w-[80vw] flex flex-col items-center border-2 border-purple-500">
      <ContestInteractionProvider>
        <div className="flex justify-center gap-4 m-auto w-[80vw] lg:py-6">
          <div className="flex flex-col w-full lg:w-3/4 gap-4">{children}</div>
          {dynamicSidebar}
        </div>
      </ContestInteractionProvider>
    </div>
  );
}
