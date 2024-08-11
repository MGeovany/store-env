"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

export const Header: React.FC = () => {
  const navigation = [
    {
      name: "Share",
      href: "/share",
    },
    {
      name: "Unseal",
      href: "/unseal",
    },

    {
      name: "Saved",
      href: "/saved",
    },
    {
      name: "GitHub",
      href: "https://github.com/mgeovany/store-env",
      external: true,
    },
  ] satisfies { name: string; href: string; external?: boolean }[];

  const pathname = usePathname();

  return (
    <header className="top-0 z-30 w-full px-4 sm:fixed backdrop-blur bh-zinc-900/50">
      <div className="container mx-auto">
        <div className="flex flex-col items-center justify-between gap-2 pt-6 sm:h-20 sm:flex-row sm:pt-0">
          <Link
            href="/"
            className="text-2xl font-semibold duration-150 text-zinc-100 hover:text-orange-500"
          >
            Store Env
          </Link>
          <nav className="flex items-center grow">
            <ul className="flex flex-wrap items-center justify-end gap-4 grow">
              {navigation.map((item) => (
                <li className="" key={item.href}>
                  <Link
                    className={`flex items-center px-3 py-2 duration-150 text-sm sm:text-base hover:text-orange-500
                    ${
                      pathname === item.href ? "text-zinc-200" : "text-zinc-400"
                    }`}
                    href={item.href}
                    target={item.external ? "_blank" : undefined}
                    rel={item.external ? "noopener noreferrer" : undefined}
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </div>
    </header>
  );
};