
"use client";

import Link from "next/link";
import Logo from "./Logo";
import { usePathname } from "next/navigation";
import AnimatedBtn from "./ButtonStyleAnimation";
import { BriefcaseBusiness, InfoIcon } from "lucide-react";

function Header() {
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
    <header
      className="
        fixed inset-x-0 top-0 z-50
        flex h-14 w-full items-center justify-between
        gap-2
        bg-amber-700
        px-3 sm:px-5 md:px-24 xl:px-72
        font-jetbrains font-bold text-gray-800
      "
    >
      <Link
        href="/"
        aria-label="TypeType home"
        className="shrink-0 cursor-pointer"
      >
        <Logo />
      </Link>

      <nav aria-label="Main navigation" className="shrink-0">
        <ul className="flex items-center gap-0 sm:gap-1">
          {navigations.map((nav) => {
            const isActive = pathname === nav.url;
            const Icon = nav.icon;

            return (
              <li key={nav.url}>
                <Link
                  href={nav.url}
                  target={nav.external ? "_blank" : undefined}
                  rel={nav.external ? "noopener noreferrer" : undefined}
                  aria-label={nav.title}
                  title={nav.title}
                  aria-current={isActive ? "page" : undefined}
                  className={`
                    group flex items-center justify-center
                    rounded-md py-2
                    text-xs sm:px-3 sm:text-sm
                    transition-colors duration-300
                    ${
                      isActive
                        ? "text-amber-400"
                        : "text-gray-800 hover:text-amber-500"
                    }
                  `}
                >
                  <AnimatedBtn
                    isActive={isActive}
                    LPunctuation="{"
                    RPunctuation="}"
                  >
                    <span className="flex md:mx-2 items-center gap-1 whitespace-nowrap">
                      <Icon size={16} />
                      <span>{nav.title}</span>
                    </span>
                  </AnimatedBtn>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </header>
  );
}

export default Header;