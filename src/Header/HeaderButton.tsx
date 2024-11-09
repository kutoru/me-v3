import HomeIcon from "../assets/home.svg?react";
import GithubIcon from "../assets/github.svg?react";
import ProjectsIcon from "../assets/projects.svg?react";
import ProfileIcon from "../assets/profile.svg?react";

export default function HeaderButton({
  href,
  icon,
  className,
  children,
}: {
  href: string;
  icon?: "home" | "github" | "projects" | "profile";
  className?: string;
  children?: string;
}) {
  function getIcon() {
    switch (icon) {
      case "home":
        return (
          <HomeIcon className="size-full fill-white group-hover/btn:fill-gray-200 group-active/btn:fill-gray-300 transition-all" />
        );
      case "github":
        return (
          <GithubIcon className="m-0.5 size-[calc(100%-0.25rem)] fill-white group-hover/btn:fill-gray-200 group-active/btn:fill-gray-300 transition-all" />
        );
      case "projects":
        return (
          <ProjectsIcon className="size-full fill-white group-hover/btn:fill-gray-200 group-active/btn:fill-gray-300 transition-all" />
        );
      case "profile":
        return (
          <ProfileIcon className="size-full fill-white group-hover/btn:fill-gray-200 group-active/btn:fill-gray-300 transition-all" />
        );
    }
  }

  function getTitle() {
    switch (icon) {
      case "home":
        return "Home";
      case "github":
        return "GitHub profile";
      case "projects":
        return "Projects";
      case "profile":
        return "About me";
    }
  }

  return (
    <a
      href={href}
      onClick={(e) => e.preventDefault()}
      title={getTitle()}
      className={
        "group/btn block h-10 hover:bg-[#ffffff30] active:bg-[#ffffff20] transition-all p-1 rounded-md" +
        (icon ? " w-10" : " w-fit") +
        " " +
        className
      }
    >
      {icon ? (
        getIcon()
      ) : (
        <span className="text-white group-hover/btn:text-gray-200 group-active/btn:text-gray-300 transition-all text-xl font-bold">
          {children}
        </span>
      )}
    </a>
  );
}
