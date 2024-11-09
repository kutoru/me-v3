export default function ProficiencyWindow({
  isShown,
  setIsShown,
}: {
  isShown: boolean;
  setIsShown: (v: boolean) => void;
}) {
  function mapSkillInfoItems() {
    const items = [
      { step: 100, text: "I know absolutely everything about the technology" },
      {
        step: 83,
        text: "I'm very confident with the technology. I used it in many projects and know most of its theory",
      },
      {
        step: 66,
        text: "I'm pretty good at the technology and I have plenty of experience with it, but I also have a few knowledge gaps",
      },
      {
        step: 50,
        text: "I can use the technology without issues, but I might not know about some of its niches and best practices",
      },
      {
        step: 33,
        text: "I know the technology and used it, but either I don't have much experience with it, or I haven't used it in a long time",
      },
      {
        step: 16,
        text: "I've barely heard of the technology, or simply never used it before",
      },
      { step: 0, text: "I don't know anything about the technology" },
    ];

    return items.map((item, index) => {
      return (
        <tr
          key={index}
          className={
            "group/tr transition-all hover:bg-white hover:bg-opacity-10 relative border-gray-400 border-b" +
            (index === 0 ? " border-t" : "")
          }
        >
          <div
            className="absolute top-0 left-0 bg-indigo-500 bg-opacity-0 h-full z-[51] transition-all group-hover/tr:bg-opacity-25"
            style={{ width: `${item.step}%` }}
          />

          <td className="text-main-light-2 font-semibold align-middle py-2 text-center z-[52] relative">
            {item.step}%
          </td>
          <td className="ps-2 py-2 z-[52] relative">{item.text}</td>
        </tr>
      );
    });
  }

  return (
    <div
      onClick={() => setIsShown(false)}
      className={
        "fixed top-0 left-0 size-full z-50 bg-black bg-opacity-50 flex cursor-pointer px-8 md:px-16 transition-all" +
        (!isShown ? " invisible opacity-0" : "")
      }
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-black bg-opacity-85 m-auto rounded-md p-4 flex flex-col gap-2 lg:max-w-[650px] cursor-default"
      >
        <div className="text-3xl text-center font-bold mb-2">
          Proficiency percentages
        </div>

        <table className="text-xl">
          <tbody>{mapSkillInfoItems()}</tbody>
        </table>
      </div>
    </div>
  );
}
