import { Document, Packer, Paragraph } from "docx";
import PDFDocument from "pdfkit";

export async function createDocx(title: string, content: string) {
  const doc = new Document({
    sections: [
      {
        children: [
          new Paragraph({ text: title, heading: "Heading1" }),
          ...content.split(/\r?\n/).map((line) => new Paragraph(line))
        ]
      }
    ]
  });
  return Packer.toBuffer(doc);
}

export function createPdf(title: string, content: string) {
  return new Promise<Buffer>((resolve, reject) => {
    const doc = new PDFDocument({ margin: 56 });
    const chunks: Buffer[] = [];
    doc.on("data", (chunk: Buffer) => chunks.push(chunk));
    doc.on("end", () => resolve(Buffer.concat(chunks)));
    doc.on("error", reject);
    doc.fontSize(18).text(title, { underline: false });
    doc.moveDown();
    doc.fontSize(11).text(content, { lineGap: 5 });
    doc.end();
  });
}
