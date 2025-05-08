import { Module, Global } from "@nestjs/common";
import { HttpExceptionFilter } from "@core/filters";
import { ResponseService } from "./response/response.service";

@Global()
@Module({
  providers: [ResponseService, HttpExceptionFilter],
  exports: [ResponseService, HttpExceptionFilter]
})
export class SharedModule {}
