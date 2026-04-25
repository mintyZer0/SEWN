export default function SewistSignupLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <div className="fixed inset-0 -z-10 bg-[url(/assets/signup-sewist/signup-sewist-bg.png)] bg-cover bg-center bg-no-repeat w-full h-full" />
      {children}
    </>
  );
}
