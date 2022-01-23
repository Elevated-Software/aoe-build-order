export class EsError extends Error {
  private _code: number;
  constructor(message: string, code: number = 500) {
    super(message);
    this._code = code;
  }

  public get code() {
    return this._code;
  }
}
