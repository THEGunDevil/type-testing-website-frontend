"use client";

import { BriefcaseBusiness, InfoIcon } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import AnimatedBtn from "./ButtonStyleAnimation";
import Logo from "./Logo";

function Footer() {
  const pathname = usePathname();

  const navigations = [
    {
      title: "About",
      url: "/about",
      icon: InfoIcon,
      external: false,
    },
    {
      title: "Portfolio",
      url: "https://himel-codes-95.vercel.app/",
      icon: BriefcaseBusiness,
      external: true,
    },
  ];

  return (
    <footer className="border-t border-gray-700/70 bg-gray-900 font-jetbrains text-gray-400">
      <div
        className="
          mx-auto flex w-full max-w-screen-2xl flex-wrap
          items-center justify-between gap-x-3 gap-y-4
          px-4 py-4
          sm:px-6 sm:py-5
          md:flex-nowrap md:px-12
          lg:px-24 xl:px-72
        "
      >
        {/* Brand */}
        <Link
          href="/"
          aria-label="TypeType home"
          className="shrink-0 text-amber-700 transition-opacity hover:opacity-80"
        >
          <Logo />
        </Link>

        {/* Navigation */}
        <nav aria-label="Footer navigation" className="ml-auto shrink-0">
          <ul className="flex flex-col items-center min-[19rem]:flex-row sm:gap-4">            {navigations.map((nav) => {
              const isActive = !nav.external && pathname === nav.url;
              const Icon = nav.icon;

              return (
                <li key={nav.url}>
                  <Link
                    href={nav.url}
                    target={nav.external ? "_blank" : undefined}
                    rel={nav.external ? "noopener noreferrer" : undefined}
                    aria-current={isActive ? "page" : undefined}
                    title={nav.title}
                    className={`
                      group flex items-center rounded-md
                      px-2 py-2 text-xs transition-colors duration-300
                      sm:px-3 sm:text-sm
                      ${
                        isActive
                          ? "text-amber-400"
                          : "text-gray-400 hover:text-amber-500"
                      }
                    `}
                  >
                    <AnimatedBtn
                      isActive={isActive}
                      LPunctuation="{"
                      RPunctuation="}"
                    >
                      <span className="flex md:mx-2 items-center gap-1 whitespace-nowrap">
                        <Icon size={15} aria-hidden="true" />
                        {nav.title}
                      </span>
                    </AnimatedBtn>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Tagline */}
        <p className="hidden text-xs text-gray-500 sm:block md:order-2">
          Type. Practice. Improve.
        </p>

        {/* Copyright: second row on phones */}
        <p className="w-full border-t border-gray-800 pt-3 text-center text-[10px] text-gray-500 md:order-3 md:w-auto md:border-0 md:pt-0">
          © {new Date().getFullYear()} TypeType. All rights reserved.
        </p>
      </div>
    </footer>
  )}

export default Footer;
