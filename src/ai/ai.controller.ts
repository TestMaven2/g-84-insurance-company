import { Body, Controller, Post } from '@nestjs/common';
import { Public } from '../auth/types/auth.decorators';
import { AiChatRequestDto } from './dto/ai-chat-request.dto';
import { AiService } from './ai.service';

@Controller('ai')
export class AiController {
  constructor(private readonly service: AiService) {}

  @Public()
  @Post('chat')
  async askAi(@Body() chatRequestDto: AiChatRequestDto): Promise<string> {
    return this.service.generateResponse(chatRequestDto);
  }
}
