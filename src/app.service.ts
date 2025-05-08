import { Injectable } from "@nestjs/common";

@Injectable()
export class AppService {
  getHealthStatus() {
    return {
      status: "ok",
      service: "meditravel-engine",
      uptime: process.uptime(),
      timestamp: new Date().toISOString()
    };
  }
}
