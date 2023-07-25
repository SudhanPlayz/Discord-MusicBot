import type { IStatusCode, IErrorCode } from '../interfaces/common';
import { ERROR_CODES, STATUS_CODES } from './constants';

export default class APIError extends Error {
  status: IStatusCode;
  code: IErrorCode;

  constructor(
    message?: Error['message'],
    status: IStatusCode = STATUS_CODES['INTERNAL_ERROR'],
    code: IErrorCode = ERROR_CODES['INTERNAL_ERROR'],
  ) {
    super(message);

    this.name = 'APIError';
    this.code = code;
    this.status = status;
  }

  static STATUS_CODES = STATUS_CODES;

  static ERROR_CODES = ERROR_CODES;
}
