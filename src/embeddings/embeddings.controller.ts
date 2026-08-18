import { Body, Controller, Post } from '@nestjs/common';
import { CreateEmbeddingsRequestDto } from './dto/create-embeddings-request.dto';
import { Public } from '../auth/types/auth.decorators';
import { EmbeddingsService } from './embeddings.service';

@Controller('embeddings')
export class EmbeddingsController {
  constructor(private readonly service: EmbeddingsService) {}

  @Public()
  @Post()
  async generateEmbeddings(
    @Body() requestDto: CreateEmbeddingsRequestDto,
  ): Promise<void> {
    await this.service.generateEmbeddings(requestDto);
  }
}
