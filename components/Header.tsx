"use client";
import Link from "next/link";
import Logo from "./Logo";
import { usePathname } from "next/navigation";

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
    <header className="fixed text-gray-800 font-bold items-center font-jetbrains xl:px-72 md:px-24 px-5 h-14 bg-amber-700 w-screen flex justify-between">
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
                // Switched to a standard flex container. Removed 'relative' as it's no longer needed.
                className={`group ${isActive ? "text-amber-500" : ""} flex items-center py-2 px-4 transition-colors font-medium`}
              >
                {/* Left Brace */}
                <span className={`
                  transition-all duration-300
                  ${isActive 
                    ? 'translate-y-0 opacity-100 text-amber-500' 
                    : 'translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100'
                  }
                `}>
                  {'{'}
                </span>
              
                {/* Link Title */}
                <span className="mx-2 transition-transform duration-300">
                  {nav.title}
                </span>
              
                {/* Right Brace */}
                <span className={`
                  transition-all duration-300
                  ${isActive 
                    ? 'translate-y-0 opacity-100 text-amber-500' 
                    : 'translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100'
                  }
                `}>
                  {'}'}
                </span>
              </Link>
            );
          })}
        </ul>
      </nav>
    </header>
  );
}

export default Header;
