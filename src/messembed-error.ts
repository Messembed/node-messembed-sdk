export class MessembedError extends Error {
  code: string;
  response?: any;

  constructor(message: string, code: string, response?: any) {
    super(message);
    Object.setPrototypeOf(this, MessembedError.prototype);

    this.code = code;
    this.response = response;
  }
}