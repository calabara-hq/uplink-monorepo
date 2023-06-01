export default function Layout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { name: string };
}) {
  return <div>{children}</div>;
}
