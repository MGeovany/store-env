"use client";
import { useSignInModal } from "../layouts/signInModal";

export function SignInButton() {
  const { SignInModal, setShowSignInModal } = useSignInModal();

  return (
    <>
      <span
        className="w-3/4 sm:text-center inline-block transition-all space-x-2  rounded px-4 py-1.5 md:py-2 text-base font-semibold leading-7 bg-zinc-50 ring-1 ring-transparent hover:ring-zinc-600/80  hover:bg-zinc-900/20 duration-150 hover:drop-shadow-cta hover:cursor-pointer text-black hover:text-orange-500"
        onClick={() => setShowSignInModal(true)}
      >
        <span className="hover:underline">Sign In</span>
        <SignInModal />
        <span aria-hidden="true">&rarr;</span>
      </span>
    </>
  );
}
