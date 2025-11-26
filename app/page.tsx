import Header from "../global/Header";

export default function Home() {
  return (
    <>
      <Header />
      <div className="bg-purple-500 w-dvw h-120"></div>
      <div className="flex flex-col align-middle justify-center bg-amber-50 gap-2">
        <h5>Our Purpose</h5>
      </div>
    </>
  );
}
