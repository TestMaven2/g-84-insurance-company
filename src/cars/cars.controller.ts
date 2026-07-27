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
} from '@nestjs/common';
import { CarsService } from './cars.service';
import { ApiOkResponse } from '@nestjs/swagger';
import { CarDto } from './dto/car.dto';
import { CarSaveDto } from './dto/car.save-dto';
import { CarUpdateDto } from './dto/car.update-dto';
import { Roles } from '../auth/types/auth.decorators';
import { Role } from '../users/enums/role.enum';

@Controller('cars')
export class CarsController {
  constructor(private readonly service: CarsService) {}

  @Roles(Role.ADMIN, Role.AGENT)
  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOkResponse({
    type: CarDto,
  })
  async create(@Body() saveDto: CarSaveDto): Promise<CarDto> {
    return await this.service.create(saveDto);
  }

  @Roles(Role.ADMIN, Role.AGENT)
  @Get()
  @ApiOkResponse({
    type: CarDto,
    isArray: true,
  })
  async getAll(): Promise<CarDto[]> {
    return await this.service.getAllActiveCars();
  }

  @Roles(Role.ADMIN, Role.AGENT)
  @Get(':id')
  @ApiOkResponse({
    type: CarDto,
  })
  async getById(@Param('id', ParseIntPipe) id: number): Promise<CarDto | null> {
    return await this.service.getActiveCarById(id);
  }

  @Roles(Role.ADMIN, Role.AGENT)
  @Patch(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateDto: CarUpdateDto,
  ): Promise<void> {
    await this.service.update(id, updateDto);
  }

  @Roles(Role.ADMIN)
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteById(@Param('id', ParseIntPipe) id: number): Promise<void> {
    await this.service.deleteById(id);
  }

  @Roles(Role.ADMIN)
  @Patch(':id/restore')
  @HttpCode(HttpStatus.NO_CONTENT)
  async restoreById(@Param('id', ParseIntPipe) id: number): Promise<void> {
    await this.service.restoreById(id);
  }

  @Roles(Role.ADMIN, Role.AGENT)
  @Patch(':carId/set-owner/:userId')
  @HttpCode(HttpStatus.NO_CONTENT)
  async setOwner(
    @Param('carId', ParseIntPipe) carId: number,
    @Param('userId', ParseIntPipe) userId: number,
  ): Promise<void> {
    await this.service.setActiveOwnerToActiveCar(carId, userId);
  }
}
