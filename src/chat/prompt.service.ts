import { Injectable } from '@nestjs/common';
import { PromptBuilder } from './prompt.builder';
import {
  BASE_PROMPT_FOR_AI_CHAT,
  BASE_PROMPT_FOR_INSURANCE_TYPE,
} from './constants/prompt.constants';

@Injectable()
export class PromptService {
  buildPromptForChat(): PromptBuilder {
    return new PromptBuilder(BASE_PROMPT_FOR_AI_CHAT);
  }

  buildPromptForInsuranceType(): PromptBuilder {
    return new PromptBuilder(BASE_PROMPT_FOR_INSURANCE_TYPE);
  }
}
