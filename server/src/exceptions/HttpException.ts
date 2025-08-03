class ExceptionError {
  public field: string;
  public message: string;

  constructor(field: string, message: string) {
    this.field = field;
    this.message = message;
  }
} 

class HttpException extends Error {
  public type: string;
  public title: string;
  public status: number;
  public detail: string;
  public errors: ExceptionError[] | null;

  constructor(type: string, title: string, status: number, message: string, detail: string, errors: ExceptionError[] | null = null) {
    super(message);
    this.type = type;
    this.title = title;
    this.status = status;
    this.message = message;
    this.detail = detail;
    this.errors = errors;
  }
}

export {ExceptionError, HttpException};
export default HttpException;