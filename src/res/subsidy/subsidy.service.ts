import { Injectable } from '@nestjs/common';
import { CreateSubsidyDto } from './dto/create-subsidy.dto';
import { UpdateSubsidyDto } from './dto/update-subsidy.dto';

@Injectable()
export class SubsidyService {
  create(createSubsidyDto: CreateSubsidyDto) {
    return 'This action adds a new subsidy';
  }

  findAll() {
    return `This action returns all subsidy`;
  }

  findOne(id: number) {
    return `This action returns a #${id} subsidy`;
  }

  update(id: number, updateSubsidyDto: UpdateSubsidyDto) {
    return `This action updates a #${id} subsidy`;
  }

  remove(id: number) {
    return `This action removes a #${id} subsidy`;
  }
}
