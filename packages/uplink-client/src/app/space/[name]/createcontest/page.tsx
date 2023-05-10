import ContestForm from "@/ui/ContestForm/ContestForm";

export default function Page({ params }: { params: { name: string } }) {
  return <ContestForm spaceName={params.name} />;
}
