import Header from "./Header";
import Footer from "./Footer";

export default function LayoutShell({
  children,
  hideHeader = false,
}: {
  children: React.ReactNode;
  hideHeader?: boolean;
}) {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-slate-50 to-slate-100">
      {!hideHeader && <Header />}
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}
