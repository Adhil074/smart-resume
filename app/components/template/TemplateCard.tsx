// //app\components\template\TemplateCard.tsx

// type TemplateCardProps = {
//   selected: boolean;
//   onClick: () => void;
//   children: React.ReactNode;
// };

// export default function TemplateCard({
//   selected,
//   onClick,
//   children,
// }: TemplateCardProps) {
//   return (
//     <div
//   onClick={onClick}
//   className={`cursor-pointer rounded-xl border-2 bg-white p-3 transition
//     ${selected ? "border-green-600" : "border-gray-200 hover:border-gray-400"}`}
// >
//   <div className="max-w-[280px] mx-auto overflow-hidden">
//     <div className="scale-[0.55] origin-top pointer-events-none">
//       {children}
//     </div>
//   </div>
  
// </div>
//   );
// }

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
      {/* FIXED THUMBNAIL FRAME */}
      <div className="h-[300px] w-[260px] mx-auto overflow-hidden flex items-start justify-center">
        {children}
      </div>
    </div>
  );
}