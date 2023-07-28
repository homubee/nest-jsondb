import { Global, Module } from "@nestjs/common";
import { JsonDBService } from "./jsondb.service";

@Global()
@Module({
  providers: [JsonDBService],
  exports: [JsonDBService],
})
export class UtilModule {}
