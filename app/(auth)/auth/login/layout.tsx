import Footer from "@/global/Footer";

export default function LoginLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <div className="fixed inset-0 -z-10 bg-[url(/assets/login-page/login-bg.png)] bg-cover bg-center bg-no-repeat w-full h-full" />
      {children}
    </>
  );
}
