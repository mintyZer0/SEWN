export default function SignupLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="relative min-h-screen">
      <div className="fixed inset-0 bg-[url(/assets/signup-page/signup-bg.png)] bg-cover bg-center bg-no-repeat w-full h-full" />
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
}
