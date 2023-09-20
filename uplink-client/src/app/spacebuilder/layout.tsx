export default function Layout({ children }: { children: React.ReactNode }) {
  return <div className="w-full md:w-3/5 lg:w-2/5 m-auto">{children}</div>;
}
