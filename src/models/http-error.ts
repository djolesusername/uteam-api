export class CustomError {
  message!: string;
  status!: number;
  additionalInfo!: string;

  constructor(message: string, status = 500, additionalInfo = "") {
    this.message = message;
    this.status = status;
    this.additionalInfo = additionalInfo;
  }
}
