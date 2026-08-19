import { Body, Controller, Post } from '@nestjs/common';
import { SaveToDbRequestDto } from './dto/save-to-db-request.dto';
import { Public } from '../auth/types/auth.decorators';
import { VectorStorageService } from './vector-storage.service';

@Controller('vector-storage')
export class VectorStorageController {
  constructor(private readonly service: VectorStorageService) {}

  @Public()
  @Post()
  async saveToDb(@Body() saveDto: SaveToDbRequestDto): Promise<void> {
    await this.service.saveToDb(saveDto);
  }
}
