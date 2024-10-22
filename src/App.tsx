import Header from "./Header/Header";
import ExpandedSkillCard from "./Home/ExpandedSkillCard";
import SkillCard from "./Home/SkillCard";
import ProjectCard from "./Home/ProjectCard";
import { useRef } from "react";
import IntroButton from "./Home/IntroButton";
import useLights from "./hooks/useLights";
import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import diagonalLinesSvg from "./assets/diagonal-lines.svg";
import useHeader from "./hooks/useHeader";

export default function App() {
  const header = useRef<HTMLDivElement>(null);
  const [shown, setShown, headerHeight, freezeFor] = useHeader(header);

  const introSection = useRef<HTMLDivElement>(null);
  useLights(introSection);

  const projectSection = useRef<HTMLDivElement>(null);
  useLights(projectSection);

  const introText = useRef<HTMLDivElement>(null);
  const introButtons = useRef<HTMLDivElement>(null);
  const projectContainer = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const textCleanup = animateIntroText();
    animateIntroButtons();
    animateProjects();

    return () => textCleanup();
  }, {});

  function animateIntroText() {
    // getting the data to work with

    const text = introText.current!.textContent!;
    const maxWidth = introText.current!.getBoundingClientRect().width;
    const parentWidth =
      introText.current!.parentElement!.getBoundingClientRect().width;

    // creating a temporary span to track the width

    const tempSpan = document.createElement("span");
    tempSpan.style.fontSize = "36px"; // text-4xl
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

    const tl = gsap.timeline({ repeat: -1, yoyo: true });
    tl.to(buttonChildren[1], {
      boxShadow: "inset 0 0 20px 0 rgba(99,102,241,0.25)",
      duration: 2,
      ease: "sine.inOut",
      delay: 1,
    });
  }

  function animateProjects() {
    const elementWidth =
      projectContainer.current!.getBoundingClientRect().width;
    const offsetWidth = (window.innerWidth - elementWidth) / 2 + elementWidth;

    Array.from(projectContainer.current!.children).forEach((e, i) => {
      gsap.from(e, {
        scrollTrigger: {
          trigger: e,
          toggleActions: "restart none none reverse",
          start: "top 75%",
        },
        x: i % 2 == 0 ? offsetWidth * -1 : offsetWidth,
        ease: "power2.out",
        duration: 2,
      });
    });
  }

  return (
    <>
      <Header ref={header} />

      <div
        ref={introSection}
        className="bg-gradient-to-br from-[hsla(244,47%,20%,0.33)] via-dark-900 to-[hsla(244,47%,20%,0.25)] relative overflow-hidden"
        style={{
          marginTop: `${headerHeight}px`,
          height: `calc(100dvh - ${headerHeight}px)`,
        }}
      >
        <div className="flex mx-auto size-full lg:max-w-4xl xl:max-w-6xl pointer-events-none select-none">
          <div className="flex flex-row my-auto">
            <div className="flex-1 text-4xl border-s-4 border-indigo-500 ps-8 py-4 z-20 overflow-hidden">
              <div ref={introText}>
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
              className="flex flex-col justify-evenly text-3xl gap-8 py-8 border-s-4 ms-16 ps-8 border-indigo-500 z-20 overflow-hidden"
            >
              <IntroButton href="/about-me" onClick={() => {}} icon="up">
                About my
                <br />
                journey
              </IntroButton>

              <IntroButton href="#skills" onClick={() => {}} icon="right">
                My technical
                <br />
                skills
              </IntroButton>

              <IntroButton href="#projects" onClick={() => {}} icon="down">
                Projects I<br />
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

        <div className="mx-auto w-full lg:max-w-4xl xl:max-w-6xl py-8 z-10 relative">
          <div className="text-center text-4xl">Technical skills</div>

          <div className="text-center text-gray-400 mt-4 cursor-default">
            Hint: click on a skill to see projects related to it
          </div>

          <div className="text-center mb-8">
            <span className="text-indigo-400 select-none cursor-pointer hover:underline active:text-indigo-500">
              How I measure proficiency percentages
            </span>
          </div>

          <div className="flex flex-col gap-4">
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

          <div className="text-center text-4xl my-8">
            My other skills include
          </div>

          <div className="grid grid-cols-4 gap-4">
            <SkillCard name="Rust" percentage={80} />
            <SkillCard name="Go" percentage={50} />
            <SkillCard name="SQL" percentage={70} />
            <SkillCard name="Skill 1" percentage={30} />
            <SkillCard name="Skill 2" percentage={50} />
            <SkillCard name="Skill 3" percentage={90} />
            <SkillCard name="Skill 4" percentage={20} />
            <SkillCard name="Skill 5" percentage={30} />
            <SkillCard name="Skill 6" percentage={66} />
            <SkillCard name="Skill 7" percentage={92} />
            <SkillCard name="Skill 8" percentage={38} />
            <SkillCard name="Skill 9" percentage={81} />
            <SkillCard name="Skill 10" percentage={59} />
            <SkillCard name="Skill 11" percentage={76} />
            <SkillCard name="Skill 12" percentage={13} />
          </div>
        </div>
      </div>

      <div
        id="projects"
        ref={projectSection}
        className="bg-gradient-to-bl from-[hsla(244,47%,20%,0.33)] via-dark-900 to-[hsla(244,47%,20%,0.05)] via-25% relative overflow-hidden"
      >
        <div className="mx-auto w-full lg:max-w-4xl xl:max-w-6xl py-8">
          <div className="relative text-center text-4xl mb-8">
            <span className="relative z-20">My experience</span>
          </div>

          <div ref={projectContainer} className="flex gap-8 flex-col">
            <ProjectCard
              name="Miku Notes"
              link="miku-notes"
              start="2024/06/13"
              end="2024/08/26"
              description="Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolore eos odio optio ducimus quos placeat voluptates necessitatibus ipsum maiores sint praesentium nulla doloribus, mollitia deleniti, accusantium id voluptatem nesciunt unde culpa reprehenderit dicta nostrum blanditiis illo officiis? Repudiandae voluptas, voluptatem recusandae magnam a cupiditate voluptates! Labore similique omnis voluptatum animi."
              imgSrc="https://i.ytimg.com/vi/8DsNRWy3Q0Q/hqdefault.jpg?sqp=-oaymwEcCOADEI4CSFXyq4qpAw4IARUAAIhCGAFwAcABBg==&rs=AOn4CLAcAMsuWNCNwH5vx6AdzVnU9zgOYw"
              imgOnRight={true}
            />
            <ProjectCard
              name="Chat App"
              link="chat-app"
              start="2024/06/13"
              end="2024/08/26"
              description="Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolore eos odio optio ducimus quos placeat voluptates necessitatibus ipsum maiores sint praesentium nulla doloribus, mollitia deleniti, accusantium id voluptatem nesciunt unde culpa reprehenderit dicta nostrum blanditiis illo officiis? Repudiandae voluptas, voluptatem recusandae magnam a cupiditate voluptates! Labore similique omnis voluptatum animi."
              imgSrc="https://i.ytimg.com/vi/gfdzYIPjhBU/hq720.jpg?sqp=-oaymwEcCNAFEJQDSFXyq4qpAw4IARUAAIhCGAFwAcABBg==&rs=AOn4CLALLLb_jyU0UNk_ec7TLzv52Y1lIQ"
              imgOnRight={false}
            />
            <ProjectCard
              name="Miku Notes Android"
              link="miku-notes-android"
              start="2024/06/13"
              end="2024/08/26"
              description="Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolore eos odio optio ducimus quos placeat voluptates necessitatibus ipsum maiores sint praesentium nulla doloribus, mollitia deleniti, accusantium id voluptatem nesciunt unde culpa reprehenderit dicta nostrum blanditiis illo officiis? Repudiandae voluptas, voluptatem recusandae magnam a cupiditate voluptates! Labore similique omnis voluptatum animi."
              imgSrc="https://i.ytimg.com/vi/8BTzfgKgo8k/hq720.jpg?sqp=-oaymwE2CNAFEJQDSFXyq4qpAygIARUAAIhCGAFwAcABBvABAfgB_gmAAtAFigIMCAAQARgWID0ofzAP&rs=AOn4CLCROWEJzvZds2fz2XglxlTr2DxmzA"
              imgOnRight={true}
            />
            <ProjectCard
              name="Professional work"
              link="professional-work"
              start="2024/06/13"
              end="2024/08/26"
              description="Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolore eos odio optio ducimus quos placeat voluptates necessitatibus ipsum maiores sint praesentium nulla doloribus, mollitia deleniti, accusantium id voluptatem nesciunt unde culpa reprehenderit dicta nostrum blanditiis illo officiis? Repudiandae voluptas, voluptatem recusandae magnam a cupiditate voluptates! Labore similique omnis voluptatum animi."
              imgSrc="https://i.ytimg.com/vi/XfUao0_54yM/hqdefault.jpg?sqp=-oaymwEcCNACELwBSFXyq4qpAw4IARUAAIhCGAFwAcABBg==&rs=AOn4CLAPtoRC9Lf0gMBOQw5HG69FdKwUEA"
              imgOnRight={false}
            />
          </div>

          <div className="text-center mt-8">
            <a
              href="/projects"
              onClick={(e) => e.preventDefault()}
              className="text-4xl text-indigo-400 hover:underline active:text-indigo-500 cursor-pointer select-none relative z-20"
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
