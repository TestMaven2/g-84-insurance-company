import { Injectable } from '@nestjs/common';
import { TxtExtractor } from './txt.extractor';
import { PdfExtractor } from './pdf.extractor';
import { DocxExtractor } from './docx.extractor';
import { UnsupportedFileFormatException } from '../../exceptions/types/unsupported-file-format.exception';
import { PageTextResult } from 'pdf-parse';

@Injectable()
export class MultiformatExtractor {
  constructor(
    private readonly txtExtractor: TxtExtractor,
    private readonly docxExtractor: DocxExtractor,
    private readonly pdfExtractor: PdfExtractor,
  ) {}

  async extract(file: Express.Multer.File): Promise<string[]> {
    switch (file.mimetype) {
      case 'text/plain':
        return [this.txtExtractor.extract(file.buffer)];

      case 'application/pdf': {
        const result: PageTextResult[] = await this.pdfExtractor.extract(
          file.buffer,
        );

        return result.map((r: PageTextResult): string => r.text);
      }

      case 'application/vnd.openxmlformats-officedocument.wordprocessingml.document': {
        const result: string = await this.docxExtractor.extract(file.buffer);
        return result.split(/\s*—\s*Page\s*\d+\s*—\s*/);
      }

      default:
        throw new UnsupportedFileFormatException(
          `${file.mimetype} format is not supported`,
        );
    }
  }
}
