import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Req,
} from '@nestjs/common';
import { AiChatRequestDto } from './dto/ai-chat-request.dto';
import { ChatService } from './chat.service';
import type { AuthenticatedRequest } from '../auth/types/authenticated-request';

@Controller('chat')
export class ChatController {
  constructor(private readonly service: ChatService) {}

  @Post()
  @HttpCode(HttpStatus.OK)
  async askAi(
    @Body() chatRequestDto: AiChatRequestDto,
    @Req() request: AuthenticatedRequest,
  ): Promise<string> {
    return this.service.generateResponse(
      chatRequestDto.message,
      request.user.role,
    );
  }
}
