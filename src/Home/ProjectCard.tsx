import RightIcon from "../assets/right.svg?react";

export default function ProjectCard({
  name,
  link,
  start,
  end,
  description,
  imgSrc,
  imgOnRight,
}: {
  name: string;
  link: string;
  start: string;
  end: string;
  description: string;
  imgSrc: string;
  imgOnRight: boolean;
}) {
  function getTextSection() {
    return (
      <div className="flex-1 p-4 flex flex-col">
        <div className="flex">
          <div className="flex-1 text-2xl font-bold">{name}</div>

          <div className="flex">
            <span className="my-auto text-gray-400">
              {start} - {end}
            </span>
          </div>
        </div>

        <div className="mt-4 flex-1">
          <span className="my-auto">{description}</span>
        </div>
      </div>
    );
  }

  function getImageSection() {
    return (
      <div className="size-48 overflow-hidden relative cursor-pointer">
        <img
          className="size-48 object-cover transition-all scale-125 group-hover/card:scale-100"
          src={imgSrc}
        />

        <a
          href={"/projects/" + link}
          className="block size-full absolute top-0 right-0 bg-[hsla(0,0%,33%,.5)] group-hover/card:bg-[hsla(0,0%,10%,.5)] transition-all p-8"
        >
          <RightIcon className="size-full fill-transparent group-hover/card:fill-[hsla(0,0%,100%,.75)] transition-all" />
        </a>
      </div>
    );
  }

  return (
    <div className="group/card border-2 border-white flex rounded-md overflow-hidden bg-dark-800">
      {imgOnRight ? getTextSection() : getImageSection()}
      <div className="flex-none w-0.5 bg-white" />
      {imgOnRight ? getImageSection() : getTextSection()}
    </div>
  );
}
