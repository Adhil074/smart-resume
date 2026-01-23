
import { Document } from "@react-pdf/renderer";
import { TemplateAPdf } from "./TemplateAPdf";
import { TemplateBPdf } from "./TemplateBPdf";
import { registerPdfFonts } from "./registerFonts";

registerPdfFonts();

type Props = {
  template: "templateA" | "templateB";
} & Parameters<typeof TemplateAPdf>[0];

export function ResumeDocument(props: Props) {
  return (
    <Document>
      {props.template === "templateA"
        ? <TemplateAPdf {...props} />
        : <TemplateBPdf {...props} />}
    </Document>
  );
}