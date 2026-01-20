// //app\components\template\TemplateCard.tsx

type TemplateCardProps = {
  selected: boolean;
  onClick: () => void;
  children: React.ReactNode;
};

export default function TemplateCard({
  selected,
  onClick,
  children,
}: TemplateCardProps) {
  return (
    <div
      onClick={onClick}
      className={`cursor-pointer content-center w-[280px] rounded-xl border-2 bg-white transition p-3
        ${selected ? "border-green-600" : "border-gray-200 hover:border-gray-400"}`}
    >
      {/* fixed thumbnail frame */}
      <div className="h-[300px] w-[260px] mx-auto overflow-hidden flex items-start justify-center">
        {children}
      </div>
    </div>
  );
}