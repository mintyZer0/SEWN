export default function SignupLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <div className="fixed inset-0 -z-10 bg-[url(/assets/signup-page/signup-bg.png)] bg-cover bg-center bg-no-repeat w-full h-full" />
      {children}
    </>
  );
}
