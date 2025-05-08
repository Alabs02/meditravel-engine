import { Module } from "@nestjs/common";
import { ServeStaticModule } from "@nestjs/serve-static";

import { join } from "path";

// CONTROLLERS
import { AppController } from "./app.controller";

// SERVICES
import { AppService } from "./app.service";

// MODULES
import { DatabaseModule } from "@database/database.module";
import { RoleModule } from "@role/role.module";
import { UserModule } from "@user/user.module";
import { AuthModule } from "@auth/auth.module";
import { AdminModule } from "@admin/admin.module";
import { ClinicModule } from "@clinic/clinic.module";
import { SharedModule } from "@shared/shared.module";

@Module({
  imports: [
    DatabaseModule,
    SharedModule,
    RoleModule,
    UserModule,
    AuthModule,
    ClinicModule,
    AdminModule,

    ServeStaticModule.forRoot({
      rootPath: join(__dirname, "..", "public", "static"),
      serveRoot: "/"
    })
  ],
  controllers: [AppController],
  providers: [AppService]
})
export class AppModule {}
