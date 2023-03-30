export default function Layout({ children, params }: { children: React.ReactNode, params: { id: string } }) {
  console.log(params)
  return <div>{children}</div>;
}
