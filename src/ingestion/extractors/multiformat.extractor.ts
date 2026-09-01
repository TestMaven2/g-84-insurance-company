import { Injectable } from '@nestjs/common';
import { TxtExtractor } from './txt.extractor';
import { PdfExtractor } from './pdf.extractor';
import { DocxExtractor } from './docx.extractor';
import { UnsupportedFileFormatException } from '../../exceptions/types/unsupported-file-format.exception';

@Injectable()
export class MultiformatExtractor {
  constructor(
    private readonly txtExtractor: TxtExtractor,
    private readonly docxExtractor: DocxExtractor,
    private readonly pdfExtractor: PdfExtractor,
  ) {}

  async extract(file: Express.Multer.File): Promise<string> {
    switch (file.mimetype) {
      case 'text/plain':
        return this.txtExtractor.extract(file.buffer);
      case 'application/pdf':
        return this.pdfExtractor.extract(file.buffer);
      case 'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
        return this.docxExtractor.extract(file.buffer);
      default:
        throw new UnsupportedFileFormatException(
          `${file.mimetype} format is not supported`,
        );
    }
  }
}
