export default function SewerLoginLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <div className="fixed inset-0 -z-10 bg-[url(/assets/signup-sewer/signup-sewer-bg.png)] bg-cover bg-center bg-no-repeat w-full h-full" />
      {children}
    </>
  );
}
