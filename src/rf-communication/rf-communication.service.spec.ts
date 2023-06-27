import { Test, TestingModule } from '@nestjs/testing';
import { RfCommunicationService } from './rf-communication.service';

describe('RfCommunicationService', () => {
  let service: RfCommunicationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RfCommunicationService],
    }).compile();

    service = module.get<RfCommunicationService>(RfCommunicationService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
