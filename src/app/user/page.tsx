import { getServerSession } from "next-auth";
import Image from "next/image";
import React from "react";
import { options } from "../api/auth/[...nextauth]/option";
import { LogoutButton } from "../components/LogoutButton";

export default async function User() {
  const session = await getServerSession(options);

  const userImage = session?.user?.image ? (
    <Image
      className="h-full w-full rounded-full"
      src={session?.user?.image}
      width={100}
      height={100}
      alt={session?.user?.name ?? "Profile Pic"}
      priority={true}
    />
  ) : null;
  return (
    <div className="dark:!bg-navy-800 shadow-shadow-500 shadow-3xl rounded-primary relative mt-32 mx-auto flex h-screen w-full max-w-[550px] flex-col items-center bg-black bg-cover bg-clip-border p-[16px] dark:text-white dark:shadow-none">
      <div
        className="relative mt-1 flex h-32 w-full justify-center rounded-xl bg-cover"
        style={{
          backgroundImage: 'url("https://i.ibb.co/FWggPq1/banner.png")',
        }}
      >
        <div className="absolute -bottom-12 flex h-[100px] w-[100px] items-center justify-center rounded-full border-[4px] border-white bg-pink-400">
          {userImage}
        </div>
      </div>
      <div className="mt-16 flex flex-col items-center">
        <h4 className="text-bluePrimary text-xl font-bold">
          {session?.user?.name}
        </h4>
        <p className="text-lightSecondary text-sm font-normal text-zinc-400 r">
          {session?.user?.email}
        </p>
      </div>
      <div className="mt-6 mb-3 flex gap-4 md:!gap-14">
        <div className="flex flex-col items-center justify-center">
          <h3 className="text-bluePrimary text-2xl font-bold">17</h3>
          <p className="text-lightSecondary text-sm font-normal">Saved</p>
        </div>
        <div className="flex flex-col items-center justify-center">
          <h3 className="text-bluePrimary text-2xl font-bold">9.7K</h3>
          <p className="text-lightSecondary text-sm font-normal">Shared</p>
        </div>
        <div className="flex flex-col items-center justify-center">
          <h3 className="text-bluePrimary text-2xl font-bold">434</h3>
          <p className="text-lightSecondary text-sm font-normal">Seal</p>
        </div>
      </div>
      <LogoutButton />
    </div>
  );
}
