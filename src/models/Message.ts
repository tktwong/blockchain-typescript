import {MessageType} from '../constants'

class Message {
  public type: MessageType;
  public data: any;

  constructor(type: MessageType, data: any) {
    this.type = type;
    this.data = data;
  }
}

export {
  Message
}