import Link from "next/link";

export default function SubmissionPage({
  params: { name, id, submissionId },
}: {
  params: { name: string; id: string; submissionId: string };
}) {
  return (
    <div>
      <Link href={`/${name}/contests/${id}`}>go back</Link>
      <p>my submission</p>
    </div>
  );
}
