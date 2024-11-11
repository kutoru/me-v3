import Header from "../Header/Header";
import ExpandedSkillCard from "./ExpandedSkillCard";
import SkillCard from "./SkillCard";
import ProjectCard from "./ProjectCard";
import { useRef, useState } from "react";
import IntroButton from "./IntroButton";
import useLights from "../hooks/useLights";
import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import diagonalLinesSvg from "../assets/diagonal-lines.svg";
import useHeader from "../hooks/useHeader";
import ProficiencyWindow from "./ProficiencyWindow";
import useBreakpoint from "../hooks/useBreakpoint";

export default function Home() {
  const header = useRef<HTMLDivElement>(null);
  const [shown, setShown, headerHeight, freezeFor] = useHeader(header);

  const screenSize = useBreakpoint();

  const introSection = useRef<HTMLDivElement>(null);
  useLights(introSection);

  const projectSection = useRef<HTMLDivElement>(null);
  useLights(projectSection);

  const introText = useRef<HTMLDivElement>(null);
  const introButtons = useRef<HTMLDivElement>(null);
  const skillHint = useRef<HTMLDivElement>(null);

  const [profWindowShown, setProfWindowShown] = useState(false);

  useGSAP(() => {
    const textCleanup = animateIntroText();
    animateIntroButtons();
    animateSkillHint();

    return () => textCleanup();
  }, {});

  function animateIntroText() {
    // getting the data to work with

    const text = introText.current!.textContent!;
    const fontSize = window
      .getComputedStyle(introText.current!, null)
      .getPropertyValue("font-size");
    const maxWidth = introText.current!.getBoundingClientRect().width;
    const parentWidth =
      introText.current!.parentElement!.getBoundingClientRect().width;

    // creating a temporary span to track the width

    const tempSpan = document.createElement("span");
    tempSpan.style.fontSize = fontSize;
    tempSpan.style.position = "fixed";
    tempSpan.style.top = "-1000px";
    tempSpan.style.maxWidth = maxWidth + "px";
    document.body.append(tempSpan);

    // adding word by word to the span and checking if it has reached max width
    // if it did, it means that there is a new line to be added

    const words = text.split(" ");
    const lines = [];
    let prevLine = "";

    for (let i = 0; i < words.length; i++) {
      tempSpan.textContent += words[i] + " ";
      const currWidth = tempSpan.getBoundingClientRect().width;

      if (currWidth === maxWidth) {
        lines.push(prevLine.trim());
        tempSpan.textContent = words[i] + " ";
      }

      prevLine = tempSpan.textContent!;
    }

    // finally checking for a remaining line and removing the span

    if (tempSpan.textContent!.length) {
      lines.push(prevLine.trim());
    }

    tempSpan.remove();

    // updating the introText element with the new lines as separate divs

    introText.current!.innerHTML = "";

    const lineElements = lines.map((line) => {
      const lineElement = document.createElement("div");
      lineElement.innerHTML = line;
      introText.current!.append(lineElement);
      return lineElement;
    });

    // and finally, here goes the animation for the lines

    lineElements.forEach((e) => {
      gsap.to(e, {
        scrollTrigger: {
          trigger: e,
          toggleActions: "restart none reverse none",
          start: "top 5%",
          end: "top -25%",
          scrub: 3,
        },
        x: parentWidth * -1,
      });
    });

    lineElements.forEach((e, i) => {
      gsap.from(e, {
        x: parentWidth * -1,
        duration: 2,
        ease: "power2.out",
        delay: 0.1 * i,
      });
    });

    // cleanup since react renders twice

    return () => {
      introText.current!.innerHTML = text;
    };
  }

  function animateIntroButtons() {
    const buttonChildren = Array.from(introButtons.current!.children);
    const buttonContWidth = introButtons.current!.getBoundingClientRect().width;

    buttonChildren.forEach((e) => {
      gsap.to(e, {
        scrollTrigger: {
          trigger: e,
          toggleActions: "restart none reverse none",
          start: "top 0%",
          end: "top -25%",
          scrub: 3,
        },
        x: buttonContWidth * -1,
      });
    });

    buttonChildren.forEach((e, i) => {
      gsap.from(e, {
        x: buttonContWidth * -1,
        duration: 2,
        ease: "power2.out",
        delay: 0.3 * i,
      });
    });

    const buttonOrder = [1, 2, 0];

    buttonOrder.forEach((buttonIndex, i) => {
      const tl = gsap.timeline({
        repeat: -1,
        delay: 1 + 5 * i,
        repeatDelay: 10,
        defaults: { ease: "sine.inOut", duration: 2 },
      });
      tl.to(buttonChildren[buttonIndex], {
        boxShadow: "inset 0 0 20px 0 rgba(99,102,241,0.25)",
      });
      tl.to(buttonChildren[buttonIndex], {
        boxShadow: "inset 0 0 20px 0 rgba(99,102,241,0)",
      });
    });
  }

  function animateSkillHint() {
    const highlight = skillHint.current!.children.item(0);
    const stConfig = {
      trigger: skillHint.current!,
      toggleActions: "play none none none",
      start: "top 25%",
    };

    gsap.from(skillHint.current!, {
      scrollTrigger: stConfig,
      opacity: 0,
      ease: "power2.out",
      duration: 0.75,
    });
    gsap.from(highlight, {
      scrollTrigger: stConfig,
      filter: "drop-shadow(0 0 4px rgba(255,255,255,1))",
      color: "white",
      ease: "power2.in",
      delay: 0.75,
      duration: 0.5,
    });
  }

  return (
    <>
      <Header ref={header} />
      <ProficiencyWindow
        isShown={profWindowShown}
        setIsShown={setProfWindowShown}
      />

      <div
        ref={introSection}
        className="bg-gradient-to-br from-[hsla(244,47%,20%,0.33)] via-dark-900 to-[hsla(244,47%,20%,0.25)] relative overflow-hidden"
        style={{
          marginTop: `${headerHeight}px`,
          height: `calc(100dvh - ${headerHeight}px)`,
        }}
      >
        <div className="flex mx-auto size-full lg:max-w-4xl xl:max-w-6xl cursor-default overflow-y-auto">
          <div className="flex flex-col gap-0 md:flex-row md:gap-0 my-auto w-full">
            <div className="flex-1 flex border-indigo-500 border-s-2 md:border-s-4 px-4 py-2 md:px-6 md:py-3 lg:px-8 lg:py-4 md:text-2xl lg:text-3xl xl:text-4xl z-20 overflow-hidden">
              <div ref={introText} className="my-auto">
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolor
                neque iste cupiditate perferendis, necessitatibus quod quasi
                soluta, debitis cumque accusamus nulla quia qui labore
                recusandae maxime tempora ex vitae nihil corrupti rem dolorum.
                Quibusdam reiciendis aut alias pariatur eos laborum, similique
                minima quas eum earum nisi fugiat nesciunt illum nostrum maxime
                perspiciatis doloribus facere vero totam placeat. Earum,
                voluptas laborum. atque repudiandae ducimus fugit. Delectus
                fugiat velit cumque?
              </div>
            </div>

            <div
              ref={introButtons}
              className="flex flex-col justify-evenly border-indigo-500 border-s-2 md:border-s-4 p-4 pt-2 md:p-6 lg:p-8 gap-4 md:gap-6 lg:gap-8 z-20 overflow-hidden"
            >
              <IntroButton href="/about-me" onClick={() => {}} icon="up">
                About my <br className="hidden md:block" />
                journey
              </IntroButton>

              <IntroButton href="#skills" onClick={() => {}} icon="right">
                My technical <br className="hidden md:block" />
                skills
              </IntroButton>

              <IntroButton href="#projects" onClick={() => {}} icon="down">
                Projects I <br className="hidden md:block" />
                worked on
              </IntroButton>
            </div>
          </div>
        </div>
      </div>

      <div
        id="skills"
        className="bg-gradient-to-b from-dark-500 via-20% via-dark-550 to-100% to-dark-600 w-full border-y-2 border-indigo-500 relative"
      >
        <div
          className="absolute top-0 left-0 size-full z-0"
          style={{ backgroundImage: `url(${diagonalLinesSvg})` }}
        />

        <div className="mx-auto w-full lg:max-w-4xl xl:max-w-6xl pt-8 z-10 relative">
          <div className="text-center text-3xl md:text-4xl">
            Technical skills
          </div>

          <div
            ref={skillHint}
            className="text-center text-gray-400 cursor-default"
          >
            <span>Hint:</span> click on a skill to see projects related to it
          </div>

          <div className="text-center mb-8">
            <span
              onClick={() => setProfWindowShown(true)}
              className="text-indigo-400 select-none cursor-pointer hover:underline active:text-indigo-500"
            >
              How I measure proficiency percentages
            </span>
          </div>

          <div className="flex flex-col">
            <ExpandedSkillCard
              name="TypeScript"
              percentage={80}
              description="Lorem ipsum dolor, sit amet consectetur adipisicing elit. Tempora hic, quae repellat culpa soluta aperiam enim optio excepturi. Libero assumenda reiciendis error. Ducimus recusandae sunt quisquam fuga, quidem dolore vitae itaque accusamus illum iure. Ducimus sint reiciendis est, ipsam fuga nihil magnam"
            />
            <ExpandedSkillCard
              name="React"
              percentage={47}
              description="Lorem ipsum dolor, sit amet consectetur adipisicing elit. Tempora hic, quae repellat culpa soluta aperiam enim optio excepturi. Libero assumenda reiciendis error. Ducimus recusandae sunt quisquam fuga, quidem dolore vitae itaque accusamus illum iure. Ducimus sint reiciendis est, ipsam fuga nihil magnam"
            />
            <ExpandedSkillCard
              name="Other skill 3"
              percentage={10}
              description="Lorem ipsum dolor, sit amet consectetur adipisicing elit. Tempora hic, quae repellat culpa soluta aperiam enim optio excepturi. Libero assumenda reiciendis error. Ducimus recusandae sunt quisquam fuga, quidem dolore vitae itaque accusamus illum iure. Ducimus sint reiciendis est, ipsam fuga nihil magnam"
            />
            <ExpandedSkillCard
              name="Last skill 72"
              percentage={98}
              description="Lorem ipsum dolor, sit amet consectetur adipisicing elit. Tempora hic, quae repellat culpa soluta aperiam enim optio excepturi. Libero assumenda reiciendis error. Ducimus recusandae sunt quisquam fuga, quidem dolore vitae itaque accusamus illum iure. Ducimus sint reiciendis est, ipsam fuga nihil magnam"
            />
          </div>

          <div className="text-center text-3xl md:text-4xl mb-8 mt-4">
            My other skills include
          </div>

          <div className="grid grid-cols-2 px-1 mb-1 md:grid-cols-4 lg:px-0 lg:mb-6">
            <SkillCard
              name="Rust"
              percentage={80}
              index={0}
              screenSize={screenSize}
            />
            <SkillCard
              name="Go"
              percentage={50}
              index={1}
              screenSize={screenSize}
            />
            <SkillCard
              name="SQL"
              percentage={70}
              index={2}
              screenSize={screenSize}
            />
            <SkillCard
              name="Skill 1"
              percentage={30}
              index={3}
              screenSize={screenSize}
            />
            <SkillCard
              name="Skill 2"
              percentage={50}
              index={4}
              screenSize={screenSize}
            />
            <SkillCard
              name="Skill 3"
              percentage={90}
              index={5}
              screenSize={screenSize}
            />
            <SkillCard
              name="Skill 4"
              percentage={20}
              index={6}
              screenSize={screenSize}
            />
            <SkillCard
              name="Skill 5"
              percentage={30}
              index={7}
              screenSize={screenSize}
            />
            <SkillCard
              name="Skill 6"
              percentage={66}
              index={8}
              screenSize={screenSize}
            />
            <SkillCard
              name="Skill 7"
              percentage={92}
              index={9}
              screenSize={screenSize}
            />
            <SkillCard
              name="Skill 8"
              percentage={38}
              index={10}
              screenSize={screenSize}
            />
            <SkillCard
              name="Skill 9"
              percentage={81}
              index={11}
              screenSize={screenSize}
            />
            <SkillCard
              name="Skill 10"
              percentage={59}
              index={12}
              screenSize={screenSize}
            />
            <SkillCard
              name="Skill 11"
              percentage={76}
              index={13}
              screenSize={screenSize}
            />
            <SkillCard
              name="Skill 12"
              percentage={13}
              index={14}
              screenSize={screenSize}
            />
          </div>
        </div>
      </div>

      <div
        id="projects"
        ref={projectSection}
        className="bg-gradient-to-bl from-[hsla(244,47%,20%,0.33)] via-dark-900 to-[hsla(244,47%,20%,0.05)] via-25% relative overflow-hidden"
      >
        <div className="mx-auto w-full lg:max-w-4xl xl:max-w-6xl py-8">
          <div className="relative text-center text-3xl md:text-4xl mb-8">
            My experience
          </div>

          <div className="flex gap-8 flex-col">
            <ProjectCard
              name="Miku Notes"
              link="miku-notes"
              start="2024/06/13"
              end="2024/08/26"
              description="Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolore eos odio optio ducimus quos placeat voluptates necessitatibus ipsum maiores sint praesentium nulla doloribus, mollitia deleniti, accusantium id voluptatem nesciunt unde culpa reprehenderit dicta nostrum blanditiis illo officiis? Repudiandae voluptas, voluptatem recusandae magnam a cupiditate voluptates! Labore similique omnis voluptatum animi."
              imgSrc="https://i.ytimg.com/vi/8DsNRWy3Q0Q/hqdefault.jpg?sqp=-oaymwEcCOADEI4CSFXyq4qpAw4IARUAAIhCGAFwAcABBg==&rs=AOn4CLAcAMsuWNCNwH5vx6AdzVnU9zgOYw"
              imgOnRight={true}
              screenSize={screenSize}
            />
            <ProjectCard
              name="Chat App"
              link="chat-app"
              start="2024/06/13"
              end="2024/08/26"
              description="Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolore eos odio optio ducimus quos placeat voluptates necessitatibus ipsum maiores sint praesentium nulla doloribus, mollitia deleniti, accusantium id voluptatem nesciunt unde culpa reprehenderit dicta nostrum blanditiis illo officiis? Repudiandae voluptas, voluptatem recusandae magnam a cupiditate voluptates! Labore similique omnis voluptatum animi."
              imgSrc="https://i.ytimg.com/vi/gfdzYIPjhBU/hq720.jpg?sqp=-oaymwEcCNAFEJQDSFXyq4qpAw4IARUAAIhCGAFwAcABBg==&rs=AOn4CLALLLb_jyU0UNk_ec7TLzv52Y1lIQ"
              imgOnRight={false}
              screenSize={screenSize}
            />
            <ProjectCard
              name="Miku Notes Android"
              link="miku-notes-android"
              start="2024/06/13"
              end="2024/08/26"
              description="Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolore eos odio optio ducimus quos placeat voluptates necessitatibus ipsum maiores sint praesentium nulla doloribus, mollitia deleniti, accusantium id voluptatem nesciunt unde culpa reprehenderit dicta nostrum blanditiis illo officiis? Repudiandae voluptas, voluptatem recusandae magnam a cupiditate voluptates! Labore similique omnis voluptatum animi."
              imgSrc="https://i.ytimg.com/vi/8BTzfgKgo8k/hq720.jpg?sqp=-oaymwE2CNAFEJQDSFXyq4qpAygIARUAAIhCGAFwAcABBvABAfgB_gmAAtAFigIMCAAQARgWID0ofzAP&rs=AOn4CLCROWEJzvZds2fz2XglxlTr2DxmzA"
              imgOnRight={true}
              screenSize={screenSize}
            />
            <ProjectCard
              name="Professional work"
              link="professional-work"
              start="2024/06/13"
              end="2024/08/26"
              description="Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolore eos odio optio ducimus quos placeat voluptates necessitatibus ipsum maiores sint praesentium nulla doloribus, mollitia deleniti, accusantium id voluptatem nesciunt unde culpa reprehenderit dicta nostrum blanditiis illo officiis? Repudiandae voluptas, voluptatem recusandae magnam a cupiditate voluptates! Labore similique omnis voluptatum animi."
              imgSrc="https://i.ytimg.com/vi/XfUao0_54yM/hqdefault.jpg?sqp=-oaymwEcCNACELwBSFXyq4qpAw4IARUAAIhCGAFwAcABBg==&rs=AOn4CLAPtoRC9Lf0gMBOQw5HG69FdKwUEA"
              imgOnRight={false}
              screenSize={screenSize}
            />
          </div>

          <div className="text-center mt-8">
            <a
              href="/projects"
              onClick={(e) => e.preventDefault()}
              className="text-3xl text-indigo-400 hover:underline active:text-indigo-500 cursor-pointer select-none md:text-4xl relative z-20"
            >
              All projects
            </a>
          </div>
        </div>
      </div>

      <div className="bg-dark-700 border-t-2 border-indigo-500 p-4">
        <div className="text-center text-gray-400">
          (will be) Hosted via GitHub Pages
        </div>

        <div className="text-center mt-2">
          <a
            className="text-indigo-400 select-none cursor-pointer hover:underline active:text-indigo-500"
            href="https://github.com/kutoru/me-v3"
          >
            Website's Repo
          </a>
        </div>
      </div>
    </>
  );
}
