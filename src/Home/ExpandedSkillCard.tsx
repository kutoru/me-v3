import { useGSAP } from "@gsap/react";
import { useRef } from "react";
import { gsap } from "gsap";

export default function ExpandedSkillCard({
  name,
  percentage,
  description,
}: {
  name: string;
  percentage: number;
  description: string;
}) {
  const mainBlock = useRef<HTMLDivElement>(null);
  const descBlock = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (!mainBlock.current || !descBlock.current) {
      return;
    }

    gsap.from(mainBlock.current, {
      scrollTrigger: {
        trigger: mainBlock.current,
        start: "top 85%",
        end: "top 60%",
        scrub: 2,
      },
      y: "-100%",
    });

    gsap.from(descBlock.current, {
      scrollTrigger: {
        trigger: descBlock.current,
        start: "top 80%",
        end: "top 55%",
        scrub: 2,
      },
      y: "-100%",
    });
  }, {});

  return (
    <div className="group/card border-t-2 border-indigo-500 flex flex-col px-2 gap-[2px] overflow-hidden md:flex-row md:gap-2">
      <div
        ref={mainBlock}
        className="group/main p-3 flex flex-col gap-3 flex-none md:rounded-b-md bg-dark-700 cursor-default"
      >
        <div className="flex-1 flex text-xl md:text-2xl">
          <span className="m-auto">{name}</span>
        </div>

        <div className="flex gap-3">
          <div className="flex-1 h-7 border-2 border-white rounded-md overflow-hidden md:w-40 md:flex-none">
            <div
              className="bg-indigo-500 h-full rounded-md border-4 border-dark-600 group-hover/main:border-[0px] group-hover/main:rounded-none transition-all"
              style={{ width: `${percentage}%` }}
            />
          </div>

          <span className="my-auto text-xl">{percentage}%</span>
        </div>
      </div>

      <div
        ref={descBlock}
        className="p-3 rounded-b-md border-indigo-500 border-t-2 bg-dark-700 md:text-lg md:border-t-0"
      >
        {description}
      </div>
    </div>
  );
}
