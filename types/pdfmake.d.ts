//smart-resume\types\pdfmake.d.ts

declare module "pdfmake/build/pdfmake" {
  interface PdfMake {
    vfs: Record<string, string>;
    createPdf: (docDefinition: unknown) => {
      getBuffer: (callback: (buffer: Uint8Array) => void) => void;
    };
  }

  const pdfMake: PdfMake;
  export default pdfMake;
}

declare module "pdfmake/build/vfs_fonts" {
  const pdfFonts: {
    pdfMake: {
      vfs: Record<string, string>;
    };
  };
  export default pdfFonts;
}