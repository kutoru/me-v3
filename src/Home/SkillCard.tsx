import { useRef } from "react";
import { getSkillCode } from "../utils";
import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import ScreenSize from "../types/ScreenSize";

export default function SkillCard({
  name,
  percentage,
  index,
  screenSize,
}: {
  name: string;
  percentage: number;
  index: number;
  screenSize: ScreenSize;
}) {
  const card = useRef<HTMLAnchorElement>(null);

  useGSAP(
    () => {
      const cols = screenSize === ScreenSize.SM ? 2 : 4;
      const delay = (index % cols) * 0.2;

      gsap.set(card.current, {
        y: "-100%",
        opacity: 0,
        visibility: "hidden",
      });

      let entryRestart: gsap.core.Tween | undefined = undefined;
      let entryReverse: gsap.core.Tween | undefined = undefined;

      const entry = gsap.to(card.current, {
        scrollTrigger: {
          trigger: card.current,
          start: "top 80%",
          toggleActions: "none none none none",
          onEnter: () => {
            entryReverse?.kill();
            entryRestart = gsap.delayedCall(delay, () => entry.restart());
          },
          onLeaveBack: () => {
            entryRestart?.kill();
            entryReverse = gsap.delayedCall(delay / 2, () => entry.reverse());
          },
        },
        y: 0,
        opacity: 1,
        ease: "power2.out",
        duration: 1,
      });

      let visibilityRestart: gsap.core.Tween | undefined = undefined;
      let visibilityReverse: gsap.core.Tween | undefined = undefined;

      const visibility = gsap.to(card.current, {
        scrollTrigger: {
          trigger: card.current,
          start: "top 80%",
          toggleActions: "none none none none",
          onEnter: () => {
            visibilityReverse?.kill();
            visibilityReverse = undefined;
            visibilityRestart = gsap.delayedCall(delay, () => {
              visibility.restart();
            });
          },
          onLeaveBack: () => {
            visibilityRestart?.kill();
            visibilityRestart = undefined;
            visibilityReverse = gsap.delayedCall(1 + delay / 2, () => {
              visibility.reverse();
            });
          },
        },
        visibility: "visible",
        duration: 0,
      });
    },
    { dependencies: [screenSize], revertOnUpdate: true },
  );

  return (
    <div className="p-1 lg:p-2">
      <a
        ref={card}
        href={"/projects?skills=" + getSkillCode(name)}
        onClick={(e) => e.preventDefault()}
        className={
          "group/block bg-dark-700 rounded-md flex flex-col p-2 gap-2 flex-none md:p-3 md:gap-3" +
          " transition-[border,box-shadow] hover:shadow-[inset_0_0_16px_0_rgba(255,255,255,0.1),0_0_0_2px_#6366f1] hover:border-t-0 hover:z-[11]" +
          " active:shadow-[inset_0_0_32px_0_rgba(0,0,0,1),0_0_0_2px_#4f46e5]"
        }
      >
        <div className="text-center text-lg md:text-xl transition-all group-hover/block:scale-[1.025]">
          {name}
        </div>

        <div className="flex gap-3 transition-all group-hover/block:scale-[0.975]">
          <div className="flex-1 h-6 border-2 border-white rounded-md overflow-hidden md:h-7">
            <div
              className={
                "bg-indigo-500 h-full rounded-md border-4 border-dark-600" +
                " transition-all group-hover/block:border-[0px] group-hover/block:rounded-none"
              }
              style={{ width: `${percentage}%` }}
            />
          </div>

          <span className="my-auto md:text-xl">{percentage}%</span>
        </div>
      </a>
    </div>
  );
}
