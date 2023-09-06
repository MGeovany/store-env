import Link from "next/link";
import { SignInButton } from "./components/shared/signIn";
import { getServerSession } from "next-auth";
import { options } from "./api/auth/[...nextauth]/option";
import UserCard from "./components/UserCard";
import { ShareButton } from "./components/shareButton";

export default async function Home() {
  const session = await getServerSession(options);

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <section className="flex flex-col gap-6">
        {session ? <UserCard user={session?.user} /> : null}
      </section>

      <div className="flex flex-col gap-8 pb-8 md:gap-16 md:pb-16 xl:pb-24">
        <div className="flex flex-col items-center justify-center max-w-3xl px-8 mx-auto mt-8  sm:mt-0 sm:px-0">
          <div className="hidden sm:mb-5 sm:flex sm:justify-center">
            <Link
              href="https://github.com/mgeovany/store-env"
              className="text-zinc-400 relative overflow-hidden rounded-full py-1.5 px-4 text-sm leading-6 ring-1 ring-zinc-100/10 hover:ring-orange-500/100 duration-150"
            >
              EnvStore is being developed by mgeovany on{" "}
              <span className="font-semibold text-zinc-200">
                GitHub <span aria-hidden="true">&rarr;</span>
              </span>
            </Link>
          </div>
          <div>
            <h1 className="py-4 text-5xl font-bold tracking-tight text-center text-transparent bg-gradient-to-t bg-clip-text from-zinc-100/50 to-white sm:text-7xl">
              Store and Share your Environment Variables Securely
            </h1>
            <p className="mt-6 leading-5 text-zinc-600 sm:text-center">
              Store your env files encrypted in your browser.
            </p>
            <div className="flex flex-col justify-center gap-4 mx-auto mt-8 sm:flex-row sm:max-w-lg ">
              {session ? <ShareButton /> : <SignInButton />}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
