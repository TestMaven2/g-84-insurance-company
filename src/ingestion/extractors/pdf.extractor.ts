import { Injectable } from '@nestjs/common';
import { PageTextResult, PDFParse, TextResult } from 'pdf-parse';

@Injectable()
export class PdfExtractor {
  async extract(content: Buffer): Promise<PageTextResult[]> {
    const parser: PDFParse = new PDFParse({ data: content });
    const result: TextResult = await parser.getText();
    await parser.destroy();
    return result.pages;
  }
}
