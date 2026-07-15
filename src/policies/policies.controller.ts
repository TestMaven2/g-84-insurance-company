import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Put,
} from '@nestjs/common';
import { PoliciesService } from './policies.service';
import { PolicySaveDto } from './dto/policy.save-dto';
import { PolicyDto } from './dto/policy.dto';

@Controller('policies')
export class PoliciesController {
  constructor(private readonly service: PoliciesService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() policy: PolicySaveDto): Promise<PolicyDto> {
    return this.service.create(policy);
  }

  @Get()
  async getAll(): Promise<PolicyDto[]> {
    return this.service.getAllActivePolicies();
  }

  @Get(':id')
  async getById(@Param('id', ParseIntPipe) id: number): Promise<PolicyDto> {
    return this.service.getActivePolicyById(id);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteById(@Param('id', ParseIntPipe) id: number): Promise<void> {
    await this.service.deleteById(id);
  }

  @Patch(':id/restore')
  @HttpCode(HttpStatus.NO_CONTENT)
  async restoreById(@Param('id', ParseIntPipe) id: number): Promise<void> {
    await this.service.restoreById(id);
  }

  @Put(':policyId/add-car/:carId')
  @HttpCode(HttpStatus.NO_CONTENT)
  async addCar(
    @Param('policyId', ParseIntPipe) policyId: number,
    @Param('carId', ParseIntPipe) carId: number,
  ): Promise<void> {
    await this.service.addActiveCarToActivePolicy(policyId, carId);
  }
}
