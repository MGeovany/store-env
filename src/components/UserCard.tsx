import Image from "next/image";
import Link from "next/link";

type User =
  | {
      name?: string | null | undefined;
      email?: string | null | undefined;
      image?: string | null | undefined;
    }
  | undefined;

type Props = {
  user: User;
};

export function UserCard({ user }: Props) {
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
        width={150}
        height={150}
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
}
