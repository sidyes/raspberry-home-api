import { Test, TestingModule } from '@nestjs/testing';
import { FanService } from './fan.service';

describe('FanService', () => {
  let service: FanService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FanService],
    }).compile();

    service = module.get<FanService>(FanService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
