import HeaderButton from "./HeaderButton";
import SlashIcon from "../assets/slash.svg?react";
import { forwardRef } from "react";

const Header = forwardRef<HTMLDivElement>(({}, ref) => {
  return (
    <div
      ref={ref}
      className="h-16 bg-dark-700 border-b-2 border-indigo-500 p-3 flex flex-row fixed left-0 w-full z-30"
    >
      <HeaderButton icon="home" href="/" />

      <SlashIcon className="fill-white size-7 my-auto hidden md:block" />

      <HeaderButton href="/projects" className="hidden md:block">
        Projects
      </HeaderButton>

      <SlashIcon className="size-7 my-auto hidden md:block" />

      <HeaderButton href="/projects/miku-notes" className="hidden md:block">
        Miku Notes
      </HeaderButton>

      <div className="flex-1" />

      <HeaderButton icon="profile" href="/about-me" className="ms-2" />
      <HeaderButton icon="projects" href="/projects" className="ms-2" />
      <HeaderButton
        icon="github"
        href="https://github.com/kutoru"
        className="ms-2"
      />
    </div>
  );
});

export default Header;
