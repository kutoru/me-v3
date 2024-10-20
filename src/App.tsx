import Header from "./Header/Header";
import UpIcon from "./assets/up.svg?react";
import RightIcon from "./assets/right.svg?react";
import DownIcon from "./assets/down.svg?react";
import ExpandedSkillCard from "./Home/ExpandedSkillCard";
import SkillCard from "./Home/SkillCard";
import ProjectCard from "./Home/ProjectCard";
import { useEffect } from "react";

export default function App() {
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      document.body.style.transition =
        "transform 1000ms cubic-bezier(0.4,0,0.2,1), opacity 1500ms cubic-bezier(0.4,0,0.2,1)";
      document.body.style.transform = "";
      document.body.style.opacity = "1";
    }, 10);

    return () => clearTimeout(timeoutId);
  }, []);

  return (
    <>
      <Header />

      <div className="bg-gradient-to-br from-indigo-950 to-dark-900 to-50%">
        <div
          className={
            "flex flex-row py-40" + " mx-auto w-full lg:max-w-4xl xl:max-w-6xl"
          }
        >
          <div className="flex-1 text-4xl border-s-4 border-indigo-500 ps-8 py-4">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolor neque
            iste cupiditate perferendis, necessitatibus quod quasi soluta,
            debitis cumque accusamus nulla quia qui labore recusandae maxime
            tempora ex vitae nihil corrupti rem dolorum. Quibusdam reiciendis
            aut alias pariatur eos laborum, similique minima quas eum earum nisi
            fugiat nesciunt illum nostrum maxime perspiciatis doloribus facere
            vero totam placeat. Earum, voluptas laborum. atque repudiandae
            ducimus fugit. Delectus fugiat velit cumque?
          </div>

          <div className="w-1 ms-12 me-8 bg-indigo-500" />

          <div className="flex flex-col justify-evenly text-3xl gap-8 py-8">
            <a
              href="/about-me"
              className="flex bg-dark-700 p-4 rounded-md border-2 border-indigo-500"
            >
              <span className="text-left text-white">
                About my
                <br />
                journey
              </span>
              <div className="flex-1 min-w-4" />
              <UpIcon className="my-auto size-10" />
            </a>

            <a
              href="#skills"
              className="flex bg-dark-700 p-4 rounded-md border-2 border-indigo-500"
            >
              <span className="text-left text-white">
                My technical
                <br />
                skills
              </span>
              <div className="flex-1 min-w-4" />
              <RightIcon className="my-auto size-10" />
            </a>

            <a
              href="#projects"
              className="flex bg-dark-700 p-4 rounded-md border-2 border-indigo-500"
            >
              <span className="text-left text-white">
                Projects I<br />
                worked on
              </span>
              <div className="flex-1 min-w-4" />
              <DownIcon className="my-auto size-10" />
            </a>
          </div>
        </div>
      </div>

      <div
        id="skills"
        className="bg-dark-600 w-full border-y-2 border-indigo-500"
      >
        <div className=" mx-auto w-full lg:max-w-4xl xl:max-w-6xl py-8">
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
        className="bg-gradient-to-tl from-indigo-950 to-dark-900 to-25%"
      >
        <div className="mx-auto w-full lg:max-w-4xl xl:max-w-6xl py-8">
          <div className="text-center text-4xl mb-8">My experience</div>

          <div className="flex gap-8 flex-col">
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
              className="text-4xl text-indigo-400 hover:underline active:text-indigo-500 cursor-pointer select-none"
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
