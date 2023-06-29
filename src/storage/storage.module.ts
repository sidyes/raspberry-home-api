import { Module, OnModuleInit } from "@nestjs/common";
import { StorageService } from "./storage.service";

@Module({
  providers: [StorageService],
  exports: [StorageService]
})
export class StorageModule implements OnModuleInit {
  constructor(private storageService: StorageService) {}

  async onModuleInit(): Promise<void> {
    await this.storageService.init();
  }
}
