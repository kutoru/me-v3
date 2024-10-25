import { useGSAP } from "@gsap/react";
import RightIcon from "../assets/right.svg?react";
import { useRef } from "react";
import { gsap } from "gsap";

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
  const projectContainer = useRef<HTMLDivElement>(null);
  const imageContainer = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const stConfig = {
      trigger: projectContainer.current,
      toggleActions: "restart none none reverse",
      start: "top 75%",
    };

    const offsetDistance =
      projectContainer.current!.getBoundingClientRect().width;

    gsap.from(projectContainer.current, {
      scrollTrigger: stConfig,
      x: imgOnRight ? offsetDistance * -1 : offsetDistance,
      ease: "power2.out",
      duration: 2,
    });

    const parent = projectContainer.current!.parentElement!;
    gsap.from(parent, {
      scrollTrigger: stConfig,
      borderColor: "rgba(99,102,241,0)",
      ease: "power2.out",
      duration: 2,
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
      <div
        ref={imageContainer}
        className="group/img size-48 overflow-hidden relative cursor-pointer"
      >
        <img
          className="size-48 object-cover transition-all scale-125 group-hover/img:scale-100"
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
        (imgOnRight ? " border-l-4" : " border-r-4")
      }
    >
      <div
        ref={projectContainer}
        className={
          "group/card border-2 border-gray-800 border-opacity-50 flex rounded-md overflow-hidden bg-dark-800 bg-opacity-75" +
          (imgOnRight
            ? " rounded-s-none border-l-0"
            : " rounded-e-none border-r-0")
        }
      >
        {imgOnRight ? getTextSection() : getImageSection()}
        <div className="flex-none w-0.5 bg-gray-800 bg-opacity-50" />
        {imgOnRight ? getImageSection() : getTextSection()}
      </div>
    </div>
  );
}
