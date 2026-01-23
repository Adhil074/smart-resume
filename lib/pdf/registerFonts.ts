import { Font } from "@react-pdf/renderer";
import path from "path";

let registered = false;

export function registerPdfFonts() {
  if (registered) return;

  Font.register({
    family: "Inter",
    fonts: [
      {
        src: path.join(process.cwd(), "lib/pdf/fonts/Inter-Regular.ttf"),
        fontWeight: "normal",
      },
      {
        src: path.join(process.cwd(), "lib/pdf/fonts/Inter-Bold.ttf"),
        fontWeight: "bold",
      },
    ],
  });

  registered = true;
}