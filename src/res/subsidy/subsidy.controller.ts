import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { SubsidyService } from './subsidy.service';
import { CreateSubsidyDto } from './dto/create-subsidy.dto';
import { UpdateSubsidyDto } from './dto/update-subsidy.dto';

@Controller('subsidy')
export class SubsidyController {
  constructor(private readonly subsidyService: SubsidyService) {}

  @Post()
  create(@Body() createSubsidyDto: CreateSubsidyDto) {
    return this.subsidyService.create(createSubsidyDto);
  }

  @Get()
  findAll() {
    return this.subsidyService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.subsidyService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateSubsidyDto: UpdateSubsidyDto) {
    return this.subsidyService.update(+id, updateSubsidyDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.subsidyService.remove(+id);
  }
}
