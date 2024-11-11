export default function SkillCard({
  name,
  percentage,
}: {
  name: string;
  percentage: number;
}) {
  return (
    <div className="bg-dark-700 rounded-md flex flex-col p-2 gap-2 flex-none md:p-3 md:gap-3">
      <div className="text-center text-lg md:text-xl">{name}</div>

      <div className="flex gap-3">
        <div className="flex-1 h-5 relative md:h-7">
          <div className="border-2 border-white size-full rounded-md" />

          <div
            className="absolute top-0 left-0 bg-indigo-500 h-full rounded-s-md border-2 border-white border-e-0"
            style={{ width: `${percentage}%` }}
          />
        </div>

        <span className="my-auto text-sm md:text-xl">{percentage}%</span>
      </div>
    </div>
  );
}
