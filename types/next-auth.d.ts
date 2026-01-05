/* eslint-disable @typescript-eslint/no-explicit-any */
// //smart-resume\types\next-auth.d.ts

// /* eslint-disable @typescript-eslint/no-explicit-any */
import NextAuth from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      email?: string | null;
      name?: string | null;
      image?: string | null;
    };
  }

  interface User {
    id: string;
  }
}
// declare module 'pdfjs-dist/legacy/build/pdf.js';
declare module 'pdf-parse/lib/pdf-parse' {
    function PDFParse(dataBuffer: Buffer, options?: any): Promise<any>;
    export default PDFParse;
}

