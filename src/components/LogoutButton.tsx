import Link from "next/link";

export function LogoutButton() {
  return (
    <Link
      href="/api/auth/signout"
      className="sm:text-center w-3/4 transition-all space-x-2 rounded px-4 py-1.5 md:py-2 text-base font-semibold leading-7 bg-zinc-50 ring-1 ring-transparent hover:ring-zinc-600/80  hover:bg-zinc-900/20 duration-150 hover:drop-shadow-cta hover:cursor-pointer text-black hover:text-orange-500 flex justify-center"
    >
      <span>Log out</span>
      <span aria-hidden="true">&rarr;</span>
    </Link>
  );
}
