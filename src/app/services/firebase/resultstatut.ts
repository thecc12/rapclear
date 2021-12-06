import { Entity } from '../../entity/entity';


export class ResultStatut extends Entity {
  code: number = ResultStatut.UNKNOW_ERROR;
  apiCode: any;
  result: any;
  message: string;
  description: string;
  // tslint:disable-next-line:member-ordering
  static RESSOURCE_NOT_FOUND_ERROR = -1;
  // tslint:disable-next-line:member-ordering
  static NETWORK_ERROR = -2;
  // tslint:disable-next-line:member-ordering
  static UNKNOW_ERROR = -10;
  // tslint:disable-next-line:member-ordering
  static INVALID_ARGUMENT_ERROR = -3;
  // tslint:disable-next-line:member-ordering
  static SUCCESS = 0;
  static UPLOAD_PAUSED=10;
  static UPLOAD_RUNNING=11;
  
  constructor(code = ResultStatut.SUCCESS, message = 'success', description = '', result = null) {
    super();
    this.code = code;
    this.message = message;
    this.description = description;
    this.result = result;
  }
  hydrate(entity) {
    super.hydrate(entity);
  }
  toString() {
    return {
      code: this.code,
      apiCode: this.apiCode,
      message: this.message,
      description: this.description,
      result: this.result,
    };
  }

}
