import Link from "next/link";

export default function HomeHeader() {
  return (
    <header className="w-full px-4 py-4 bg-primary-dark text-white flex gap-2 justify-between items-center">
      <Link className="flex gap-2" href="/home">
        <img className="w-8" src="/favicon.ico" alt="TimeFrame logo" />
        <h1 className="text-2xl font-semibold">TimeFrame</h1>
      </Link>
      <div className="flex gap-4 items-center">
      <Link
          className="text-l font-normal bg-#6C63FF px-4 py-1 rounded-full bg-background text-white"
          href="settings"
        >
          Settings
        </Link>
      </div>
    </header>
  );
}
