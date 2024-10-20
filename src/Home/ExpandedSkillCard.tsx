export default function ExpandedSkillCard({
  name,
  percentage,
  description,
}: {
  name: string;
  percentage: number;
  description: string;
}) {
  return (
    <div className="group/card bg-dark-700 border-t-2 rounded-b-md border-indigo-500 flex">
      <div className="p-3 flex flex-col gap-3 flex-none">
        <div className="flex-1 flex text-2xl">
          <span className="m-auto">{name}</span>
        </div>

        <div className="flex gap-3">
          <div className="w-40 h-7 border-2 border-white rounded-md overflow-hidden">
            <div
              className="bg-indigo-500 h-full rounded-md border-4 border-dark-600 group-hover/card:border-[0px] group-hover/card:rounded-none transition-all"
              style={{ width: `${percentage}%` }}
            />
          </div>

          <span className="my-auto text-xl">{percentage}%</span>
        </div>
      </div>

      <div className="bg-dark-800 w-0.5 flex-none" />

      <div className="p-3 text-lg">{description}</div>
    </div>
  );
}
