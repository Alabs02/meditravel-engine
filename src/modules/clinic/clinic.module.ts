import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";

import { Clinic, ClinicSchema } from "./entities/clinic.entity";
import { ClinicRepository } from "./repositories/clinic.repository";
import { ClinicService } from "./services/clinic.service";
import { ClinicController } from "./controllers/clinic.controller";

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Clinic.name,
        schema: ClinicSchema
      }
    ])
  ],
  providers: [ClinicRepository, ClinicService],
  controllers: [ClinicController],
  exports: [ClinicService, ClinicRepository]
})
export class ClinicModule {}
