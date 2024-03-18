import { v4 as uuidv4 } from 'uuid';
import { useSubscribe } from './react';

export class Transaction {
  constructor(reflect, mutator, args, reason) {
    this.transactionID = String(Date.now()) + '_' + uuidv4();
    this.reflect = reflect;
    this.mutator = mutator;
    this.mutatorArgs = args;
    this.reason = reason;
  }

  get(key) {
    return this.reflect.localState[key];
  }

  set(key, value) {
    if (this.reason === 'initial') {
      this.reflect.localState[key] = value; //update local KV

      this.reflect.notify(key, { ...this.reflect.localState }) //alert subscribers so that

      //send transaction to the server if this is the first time and not a replay
      this.reflect.socket.send(JSON.stringify({
        transactionID: this.transactionID,
        mutator: this.mutator,
        mutatorArgs: this.mutatorArgs,
      })) // send transactionId, mutator name, and arguments through websocket if the frist time
    } else if (this.reason === 'replay') {
      this.reflect.localState[key] = value; //update local KV
    }
  }

  delete(key) {
    this.reflect.localState.delete(key)
  }
}