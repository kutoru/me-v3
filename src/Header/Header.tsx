import HeaderButton from "./HeaderButton";
import SlashIcon from "../assets/slash.svg?react";

export default function Header() {
  return (
    <div className="h-16 bg-dark-700 border-b-2 border-indigo-500 p-3 flex flex-row">
      <HeaderButton icon="home" href="/" />

      <SlashIcon className="fill-white size-7 my-auto" />

      <HeaderButton href="/projects">Projects</HeaderButton>

      <SlashIcon className="size-7 my-auto" />

      <HeaderButton href="/projects/miku-notes">Miku Notes</HeaderButton>

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
}
