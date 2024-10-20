export default function SkillCard({
  name,
  percentage,
}: {
  name: string;
  percentage: number;
}) {
  return (
    <div className="bg-dark-700 border-2 rounded-md border-white p-3 flex flex-col gap-3 flex-none text-xl">
      <div className="text-center">{name}</div>

      <div className="flex gap-3">
        <div className="flex-1 h-7 relative">
          <div className="border-2 border-white size-full rounded-md" />

          <div
            className="absolute top-0 left-0 bg-indigo-500 h-full rounded-s-md border-2 border-white border-e-0"
            style={{ width: `${percentage}%` }}
          />
        </div>

        <span className="my-auto">{percentage}%</span>
      </div>
    </div>
  );
}
