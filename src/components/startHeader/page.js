import Link from "next/link";

export default function StartHeader() {
  return (
    <header className="px-4 py-4 bg-primary-dark text-background flex gap-2 justify-between items-center">
      <Link className="flex gap-2" href="">
        <img className="w-8" src="favicon.ico" alt="TimeFrame logo" />
        <h1 className="text-2xl font-semibold">TimeFrame</h1>
      </Link>
      <div className="flex gap-4 items-center">
        <Link
          className="text-l font-normal text-background px-4 py-1 rounded-full bg-background text-primary-dark"
          href="login"
        >
          Login
        </Link>
        <Link className="text-l font-normal" href="register">
          Register
        </Link>
      </div>
    </header>
  );
}
