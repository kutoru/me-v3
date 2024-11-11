import { useGSAP } from "@gsap/react";
import { useRef } from "react";
import { gsap } from "gsap";
import { getSkillCode } from "../utils";

const blockTransition = `
  transition-[border,box-shadow]
  hover:shadow-[inset_0_0_16px_0_rgba(255,255,255,0.1),0_0_0_2px_#6366f1]
  hover:border-t-0
  hover:z-[11]
  active:shadow-[inset_0_0_32px_0_rgba(0,0,0,1),0_0_0_2px_#4f46e5]
`;

export default function ExpandedSkillCard({
  name,
  percentage,
  description,
}: {
  name: string;
  percentage: number;
  description: string;
}) {
  const mainBlock = useRef<HTMLAnchorElement>(null);
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
    <div className="group/card border-t-2 border-indigo-500 flex flex-col px-2 pb-4 overflow-hidden md:flex-row md:gap-2">
      <a
        ref={mainBlock}
        href={"/projects?skills=" + getSkillCode(name)}
        onClick={(e) => e.preventDefault()}
        className={
          "group/block p-3 flex flex-col gap-3 flex-none md:rounded-b-md bg-dark-700" +
          blockTransition
        }
      >
        <div className="flex-1 flex text-2xl transition-all group-hover/block:scale-[1.01]">
          <span className="m-auto">{name}</span>
        </div>

        <div className="flex gap-3 transition-all group-hover/block:scale-[0.975]">
          <div className="flex-1 h-7 border-2 border-white rounded-md overflow-hidden md:w-40 md:flex-none">
            <div
              className={
                "bg-indigo-500 h-full rounded-md border-4 border-dark-600" +
                " transition-all group-hover/block:border-[0px] group-hover/block:rounded-none"
              }
              style={{ width: `${percentage}%` }}
            />
          </div>

          <span className="my-auto text-xl">{percentage}%</span>
        </div>
      </a>

      <div
        ref={descBlock}
        className={
          "group/block p-3 rounded-b-md border-indigo-500 border-t-2 bg-dark-700 cursor-default md:text-lg md:border-t-0" +
          blockTransition
        }
      >
        <div className="transition-all group-hover/block:scale-[1.01]">
          {description}
        </div>
      </div>
    </div>
  );
}
