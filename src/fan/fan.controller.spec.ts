import { Test, TestingModule } from '@nestjs/testing';
import { FanController } from './fan.controller';

describe('FanController', () => {
  let controller: FanController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FanController],
    }).compile();

    controller = module.get<FanController>(FanController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
