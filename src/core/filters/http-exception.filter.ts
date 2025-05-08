import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Injectable
} from "@nestjs/common";
import { Response } from "express";
import { ResponseService } from "@shared/response/response.service";

@Catch()
@Injectable()
export class HttpExceptionFilter implements ExceptionFilter {
  constructor(private readonly responseService: ResponseService) {}

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const res = ctx.getResponse<Response>();

    const isHttpException = exception instanceof HttpException;
    const status = isHttpException
      ? exception.getStatus()
      : HttpStatus.INTERNAL_SERVER_ERROR;

    const message = isHttpException
      ? exception.message || "An unexpected error occurred"
      : "Internal server error";

    const errorResponse = this.responseService.error({
      code: status,
      message,
      errors: isHttpException
        ? (exception.getResponse() as any).message || exception.getResponse()
        : exception
    });

    res.status(status).json(errorResponse);
  }
}
