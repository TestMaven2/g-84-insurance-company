import { Injectable } from '@nestjs/common';

@Injectable()
export class TxtExtractor {
  extract(content: Buffer): string {
    return content.toString('utf-8');
  }
}
