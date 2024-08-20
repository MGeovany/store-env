import { FC } from "react";
import { User } from "@/types/user";
import Image from "next/image";
import Link from "next/link";

type UserCardProps = {
  user: User;
};

export const UserCard: FC<UserCardProps> = ({ user }) => {
  const greeting = user?.name ? (
    <div className="flex flex-col items-center text-sm sm:text-base text-zinc-400">
      👋 Hi {user?.name}!
    </div>
  ) : null;

  const userImage = user?.image ? (
    <Link href={"/user"}>
      <Image
        className="rounded-full mx-auto mt-5 ring-1 ring-orange-500/100 duration-150"
        src={user?.image}
        width={60}
        height={60}
        alt={user?.name ?? "Profile Pic"}
        priority={true}
      />
    </Link>
  ) : null;

  return (
    <section className="flex flex-col gap-4">
      {greeting}
      {userImage}
    </section>
  );
};
