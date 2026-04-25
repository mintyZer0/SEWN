export default function SewistLoginLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="relative min-h-screen">
      <div className="fixed inset-0 bg-[url(/assets/signup-sewist/signup-sewist-bg.png)] bg-cover bg-center bg-no-repeat w-full h-full" />
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
}
