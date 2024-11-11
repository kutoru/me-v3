import { useGSAP } from "@gsap/react";
import RightIcon from "../assets/right.svg?react";
import { useRef } from "react";
import { gsap } from "gsap";
import ScreenSize from "../types/ScreenSize";

export default function ProjectCard({
  name,
  link,
  start,
  end,
  description,
  imgSrc,
  imgOnRight,
  screenSize,
}: {
  name: string;
  link: string;
  start: string;
  end: string;
  description: string;
  imgSrc: string;
  imgOnRight: boolean;
  screenSize: ScreenSize;
}) {
  const projectContainer = useRef<HTMLDivElement>(null);
  const imageContainer = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const defaultConfig = {
      scrollTrigger: {
        trigger: projectContainer.current,
        toggleActions: "restart none none reverse",
        start: "top 75%",
      },
      ease: "power2.out",
      duration: 2,
    };

    gsap.from(projectContainer.current, {
      ...defaultConfig,
      x: imgOnRight ? "-100%" : "100%",
    });

    const parent = projectContainer.current!.parentElement!;
    gsap.from(parent, {
      ...defaultConfig,
      borderColor: "rgba(99,102,241,0)",
    });

    animateImageContainer();
  });

  function animateImageContainer(previousTl?: gsap.core.Timeline) {
    previousTl?.kill();

    const tl = gsap.timeline({
      defaults: { ease: "sine.inOut" },
      onComplete: () => animateImageContainer(tl),
    });
    tl.set(imageContainer.current!, {
      boxShadow: "0 0 25px 5px rgba(99,102,241,0)",
    });

    tl.to(imageContainer.current!, {
      boxShadow: "0 0 25px 5px rgba(99,102,241,0.33)",
      duration: () => 2 + Math.random() * 3,
    });
    tl.to(imageContainer.current!, {
      boxShadow: "0 0 25px 5px rgba(99,102,241,0)",
      duration: () => 2 + Math.random() * 3,
    });
  }

  function getSmallTextSection() {
    return (
      <div className="flex-1 flex flex-col p-2">
        <div className="flex">
          {!imgOnRight && getImageSection()}

          <div className="flex-1 text-center my-auto">
            <div className="text-2xl font-bold">{name}</div>
            <div className="text-gray-400">
              {start} - {end}
            </div>
          </div>

          {imgOnRight && getImageSection()}
        </div>

        <div className="mt-2">{description}</div>
      </div>
    );
  }

  function getTextSection() {
    return (
      <div className="flex-1 flex flex-col p-2 gap-2 lg:p-4 lg:gap-4">
        <div className="flex">
          <div className="flex-1 text-2xl font-bold">{name}</div>

          <div className="flex">
            <span className="my-auto text-gray-400">
              {start} - {end}
            </span>
          </div>
        </div>

        <div className="flex-1">
          <span className="my-auto">{description}</span>
        </div>
      </div>
    );
  }

  function getImageSection() {
    return (
      <div
        ref={imageContainer}
        className={
          "group/img overflow-hidden relative cursor-pointer" +
          " size-24 border-gray-800 border-opacity-50 border-b-2 -mt-2" +
          (imgOnRight
            ? " border-s-2 -me-2 rounded-es-md"
            : " border-e-2 -ms-2 rounded-ee-md") +
          " md:size-52 xl:size-48 md:border-0 md:m-0 md:rounded-none"
        }
      >
        <img
          className="size-24 object-cover transition-all scale-125 group-hover/img:scale-100 md:size-52 xl:size-48"
          src={imgSrc}
        />

        <a
          href={"/projects/" + link}
          className="block size-full absolute top-0 right-0 bg-[hsla(0,0%,33%,.5)] group-hover/img:bg-[hsla(0,0%,10%,.5)] transition-all p-8"
        >
          <RightIcon className="size-full fill-transparent group-hover/img:fill-[hsla(0,0%,100%,.75)] transition-all" />
        </a>
      </div>
    );
  }

  return (
    <div
      className={
        "py-2 border-indigo-500 z-20 overflow-hidden" +
        (imgOnRight
          ? " border-l-2 pe-0.5 md:border-l-4 md:pe-1"
          : " border-r-2 ps-0.5 md:border-r-4 md:ps-1") +
        " lg:px-0"
      }
    >
      <div
        ref={projectContainer}
        className={
          "group/card border-2 border-gray-800 border-opacity-50 flex flex-col overflow-hidden bg-dark-800 bg-opacity-75 md:flex-row" +
          (imgOnRight ? " rounded-e-md border-l-0" : " rounded-s-md border-r-0")
        }
      >
        {screenSize === ScreenSize.SM ? (
          getSmallTextSection()
        ) : (
          <>
            {imgOnRight ? getTextSection() : getImageSection()}
            <div className="hidden flex-none w-0.5 bg-gray-800 bg-opacity-50 md:block" />
            {imgOnRight ? getImageSection() : getTextSection()}
          </>
        )}
      </div>
    </div>
  );
}
