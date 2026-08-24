import { Injectable } from '@nestjs/common';

@Injectable()
export class ChunkingService {
  getChunks(text: string): string[] {
    return [text];
  }
}
