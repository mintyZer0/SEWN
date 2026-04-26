import Header from "@/global/Header";
import Footer from "@/global/Footer";

export default function NavListLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="bg-white min-h-screen">
      <Header />
      {children}
      <Footer />
    </div>
  );
}
