import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { Public } from '../auth/types/auth.decorators';
import { AiChatRequestDto } from './dto/ai-chat-request.dto';
import { ChatService } from './chat.service';

@Controller('chat')
export class ChatController {
  constructor(private readonly service: ChatService) {}

  @Public()
  @Post()
  @HttpCode(HttpStatus.OK)
  async askAi(@Body() chatRequestDto: AiChatRequestDto): Promise<string> {
    return this.service.generateResponse(chatRequestDto.message);
  }
}
