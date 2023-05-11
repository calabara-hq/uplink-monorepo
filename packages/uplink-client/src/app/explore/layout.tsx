
export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="w-[90vw] m-auto">
      {children}
    </div>
  );
}
