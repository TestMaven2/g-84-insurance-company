import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
} from '@nestjs/common';
import { Policy } from './policy.entity';
import { InsuranceType } from './enums/insurance-type.enum';

@Controller('policies')
export class PoliciesController {
  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() policy: Policy): Policy {
    console.log('Saved policy:', policy);
    return policy;
  }

  @Get()
  getAll(): Policy[] {
    const policy1: Policy = new Policy();
    policy1.type = InsuranceType.CASCO;
    const policy2: Policy = new Policy();
    policy2.type = InsuranceType.LIABILITY;
    return [policy1, policy2];
  }

  @Get(':id')
  getById(@Param('id', ParseIntPipe) id: number): Policy {
    console.log('Id:', id);
    const policy: Policy = new Policy();
    policy.type = InsuranceType.CASCO;
    return policy;
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  deleteById(@Param('id', ParseIntPipe) id: number): void {
    console.log('Deleted id:', id);
  }
}
