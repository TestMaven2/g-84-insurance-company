import { Injectable } from '@nestjs/common';

@Injectable()
export class CleanService {
  cleanText(text: string): string {
    return text.replace(/\s+/g, ' ').trim();
  }
}
