import Header from "@/global/Header";
import Footer from "@/global/Footer";

export default function SewistProfilesLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <Header />
      {children}
      <Footer />
    </>
  );
}
