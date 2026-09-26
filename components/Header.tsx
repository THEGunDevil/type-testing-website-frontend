"use client";

function Header() {
  const navigations = [
    {
      title: "Challenge Yourself",
    },
    {
      title: "Practice",
    },
  ];
  return (
    <header className="fixed text-gray-800 font-bold items-center font-jetbrains xl:px-72 md:px-24 px-5 h-14 bg-amber-700 w-screen flex justify-between">
      <div className="cursor-pointer">
        TypeType
      </div>
      <div className="flex space-x-10">
        {navigations.map((nav, index) => (
          <nav className="hover:text-amber-500 cursor-pointer duration-200 transition-colors" key={index}>{nav.title}</nav>
        ))}
      </div>
    </header>
  );
}

export default Header;
