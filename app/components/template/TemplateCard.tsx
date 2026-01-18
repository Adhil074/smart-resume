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
  className={`cursor-pointer rounded-xl border-2 bg-white p-4 transition
    ${selected ? "border-green-600" : "border-gray-200 hover:border-gray-400"}`}
>
  <div className="max-w-[280px] mx-auto overflow-hidden">
    <div className="scale-[0.55] origin-top pointer-events-none">
      {children}
    </div>
  </div>
</div>
  );
}