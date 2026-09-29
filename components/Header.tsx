"use client";
import Link from "next/link";
import Logo from "./Logo";
import { usePathname } from "next/navigation";
import AnimatedBtn from "./ButtonStyleAnimation";

function Header() {
  const pathname = usePathname();
  const navigations = [
    {
      title: "Challenge Yourself",
      url: "/",
    },
    {
      title: "Practice",
      url: "/practice",
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
        <ul className="flex space-x-4">
          {navigations.map((nav, index) => {
            const isActive = pathname === nav.url;

            return (
              <Link
                key={index}
                href={nav.url}
                className={`
                  group flex items-center px-4 py-2
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
                  <span className="mx-2">
                    {nav.title}
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
