import UpIcon from "../assets/up.svg?react";
import RightIcon from "../assets/right.svg?react";
import DownIcon from "../assets/down.svg?react";

export default function IntroButton({
  children,
  href,
  onClick,
  icon,
}: {
  children: (string | React.ReactElement)[];
  href: string;
  onClick: () => void;
  icon: "up" | "right" | "down";
}) {
  function getIcon() {
    const className =
      "my-auto size-8 md:size-9 lg:size-10 group-hover/btn:scale-125 transition-all group-hover/btn:drop-shadow-[0_0_5px_hsla(0,0%,100%,0.25)] group-active/btn:fill-gray-300";

    switch (icon) {
      case "up":
        return <UpIcon className={className} />;
      case "right":
        return <RightIcon className={className} />;
      case "down":
        return <DownIcon className={className} />;
    }
  }

  return (
    <a
      href={href}
      onClick={(e) => {
        // e.preventDefault();
        onClick();
      }}
      className={
        "flex bg-dark-600 bg-opacity-50 p-2 text-xl rounded-md border-2 border-black border-opacity-25 pointer-events-auto md:p-3 lg:p-4 md:text-2xl lg:text-3xl" +
        " group/btn transition-[border-color,background-color] hover:bg-dark-500 hover:bg-opacity-30 hover:border-opacity-75 hover:border-indigo-500 active:border-opacity-50"
      }
    >
      <span
        className={
          "text-left text-white transition-all" +
          " group-hover/btn:drop-shadow-[0_0_5px_hsla(0,0%,100%,0.25)] group-hover/btn:scale-95 group-active/btn:text-gray-300"
        }
      >
        {children}
      </span>

      <div className="flex-1 min-w-4" />

      {getIcon()}
    </a>
  );
}
