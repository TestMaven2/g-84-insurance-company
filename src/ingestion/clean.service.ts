import { Injectable } from '@nestjs/common';

@Injectable()
export class CleanService {
  cleanText(text: string): string {
    text = this.normalizeLineEndings(text);
    text = this.collapseSpaces(text);
    text = this.removeCompanyName(text);
    text = this.removeCopyright(text);
    text = this.removePdfPageMarkers(text);
    text = this.removeRusPageNumbers(text);
    text = this.removeEngPageNumbers(text);
    text = this.removeHorizontalLines(text);
    text = this.collapseEmptyLines(text);

    return text;
  }

  private normalizeLineEndings(text: string): string {
    return text.replace(/\r\n?/g, '\n');
  }

  private collapseSpaces(text: string): string {
    return text.replace(/ +/g, ' ');
  }

  private removeCompanyName(text: string): string {
    return text.replace(/^\s*europrotect insurance\s*$/gim, '');
  }

  private removeCopyright(text: string): string {
    return text.replace(/^\s*©\s*europrotect insurance\s*$/gim, '');
  }

  private removePdfPageMarkers(text: string): string {
    return text.replace(/^\s*--\s*\d+\s*of\s*\d+\s*--\s*$/gim, '');
  }

  private removeRusPageNumbers(text: string): string {
    return text.replace(/^\s*страница\s*\d+\s*$/gim, '');
  }

  private removeEngPageNumbers(text: string): string {
    return text.replace(/^\s*—\s*page\s*\d+\s*—\s*$/gim, '');
  }

  private removeHorizontalLines(text: string): string {
    return text.replace(/^\s*─+\s*$/gm, '');
  }

  private collapseEmptyLines(text: string): string {
    return text.replace(/\n{3,}/g, '\n\n');
  }
}
