import { Injectable } from '@nestjs/common';
import { PDFParse, TextResult } from 'pdf-parse';

@Injectable()
export class PdfExtractor {
  async extract(content: Buffer): Promise<string> {
    const parser: PDFParse = new PDFParse({ data: content });
    const result: TextResult = await parser.getText();
    await parser.destroy();
    return result.text;
  }
}
