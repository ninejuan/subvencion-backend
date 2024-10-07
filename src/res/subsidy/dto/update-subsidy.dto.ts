import { PartialType } from '@nestjs/mapped-types';
import { CreateSubsidyDto } from './create-subsidy.dto';

export class UpdateSubsidyDto extends PartialType(CreateSubsidyDto) {}
