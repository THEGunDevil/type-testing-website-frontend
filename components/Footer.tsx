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
      icon:InfoIcon
    },
    {
      url: "https://himel-codes-95.vercel.app/",
      icon: BriefcaseBusiness,
    },
  ];

  return (
    <footer className="border-t border-gray-700 bg-gray-900 font-jetbrains text-gray-400">
      <div className="mx-auto flex md:px-24 xl:px-72 flex-col items-center justify-between gap-4 px-5 py-6 md:flex-row">
        {/* Brand */}
        <div className="text-sm flex items-center">
          <span className="text-amber-700"><Logo/></span>
          <span className="mx-2 text-gray-600">•</span>
          <span>Type. Practice. Improve.</span>
        </div>

        {/* Navigation */}
        <nav>
          <ul className="flex space-x-3">
            {navigations.map((nav, index) => {
              const isActive = pathname === nav.url;
              const Icon = nav.icon;
              return (
                <Link
                  key={index}
                  href={nav.url}
                  className={`
                    group flex items-center
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
                    <span className="mx-2 flex items-center gap-1">
                      {" "}
                      {Icon && <Icon size={16} />} {nav.title}{" "}
                    </span>
                  </AnimatedBtn>
                </Link>
              );
            })}
          </ul>
        </nav>

        {/* Copyright */}
        <p className="text-xs text-gray-500">
          © {new Date().getFullYear()} TypeType
        </p>
      </div>
    </footer>
  );
}

export default Footer;
