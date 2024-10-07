import { Test, TestingModule } from '@nestjs/testing';
import { SubsidyController } from './subsidy.controller';
import { SubsidyService } from './subsidy.service';

describe('SubsidyController', () => {
  let controller: SubsidyController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SubsidyController],
      providers: [SubsidyService],
    }).compile();

    controller = module.get<SubsidyController>(SubsidyController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
