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
      icon:InfoIcon
    },
    {
      url: "https://himel-codes-95.vercel.app/",
      icon: BriefcaseBusiness,
    },
  ];
  return (
    <header
      className="
        fixed top-0 left-0 z-50
        flex h-14 w-full items-center justify-between
        bg-amber-700
        px-5 md:px-24 xl:px-72
        font-jetbrains font-bold text-gray-800
      "
    >
      {" "}
      <Link href={"/"} className="cursor-pointer">
        <Logo />
        {/*<Image src="/icon.svg" alt="TypeType Icon" width={200} height={100} />*/}
      </Link>
      <nav>
        <ul className="flex">
          {navigations.map((nav, index) => {
            const isActive = pathname === nav.url;
            const Icon = nav.icon;
            return (
              <Link
                key={index}
                href={nav.url}
                className={`
                  group flex items-center px-4
                  font-medium
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
                    {Icon && <Icon size={16} />} {nav.title}{" "}
                  </span>
                </AnimatedBtn>
              </Link>
            );
          })}
        </ul>
      </nav>
    </header>
  );
}

export default Header;
