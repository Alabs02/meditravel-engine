import { Injectable } from "@nestjs/common";
import {
  ErrorParams,
  ErrorResponse,
  SuccessParams,
  SuccessResponse
} from "./reponse.types";

@Injectable()
export class ResponseService {
  success<T>({
    data,
    message = "Request successful",
    code = 200
  }: SuccessParams<T>): SuccessResponse<T> {
    return {
      data,
      message,
      statusCode: code,
      isSuccessful: true,
      errors: null
    };
  }

  error({
    errors,
    message = "Request failed",
    code = 500
  }: ErrorParams): ErrorResponse {
    return {
      data: null,
      message,
      statusCode: code,
      isSuccessful: false,
      errors
    };
  }
}
