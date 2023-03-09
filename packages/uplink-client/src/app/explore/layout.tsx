
export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="w-11/12 m-auto">
      {children}
    </div>
  );
}
