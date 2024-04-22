import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  Put,
} from '@nestjs/common';
import { FotocopyService } from './fotocopy.service';

@Controller('fotocopy')
export class FotocopyController {
  constructor(private fotocopyService: FotocopyService) {}

  @Get()
  async getFotocopy() {
    return await this.fotocopyService.getAllFotocopy();
  }

  @Post()
  async createFotocopy(@Body() data) {
    return await this.fotocopyService.addNewFotocopy(data);
  }

  @Put(':id')
  async editFotocopy(@Body() data) {
    return await this.fotocopyService.editFotocopy(data);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.fotocopyService.deleteFotocopy(+id);
  }
}
