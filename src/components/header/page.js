import Link from "next/link";

export default function HomeHeader(props) {
  if(props.header=="home")
  {
    return (
      <header className="w-full px-4 py-4 bg-background text-white flex gap-2 justify-between items-center shadow-lg shadow-[#101010]">
        <Link className="flex gap-2" href="/home">
          <img className="w-8" src="/favicon.ico" alt="TimeFrame logo" />
          <h1 className="text-3xl font-semibold">TimeFrame</h1>
        </Link>
        <div className="flex gap-4 items-center">
        <Link
            className="text-lg font-normal bg-primary-dark px-4 py-1 rounded-full text-white"
            href="settings"
          >
            Settings
          </Link>
        </div>
      </header>
    );
  }
  else if(props.header=="start"){
    return (
      <header className="px-4 py-4 text-primary-dark flex gap-2 justify-between items-center">
        <Link className="flex gap-2" href="">
          <img className="w-8" src="favicon.ico" alt="TimeFrame logo" />
          <h1 className="text-2xl font-semibold">TimeFrame</h1>
        </Link>
        <div className="flex gap-4 items-center">
          <Link
            className="text-l font-normal text-background px-4 py-1 rounded-full bg-primary-dark text-white"
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
}
