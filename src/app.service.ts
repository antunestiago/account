import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';

@Injectable()
export class AppService {
  constructor(private eventEmitter: EventEmitter2) {}

  getHello(): string {
    return 'Hello World!';
  }

  //TODO: Peharps theres no need to do it here but in app controller
  async handlerEvents(eventMessage: string): Promise<any> {
    this.eventEmitter.emit(eventMessage['type'], eventMessage['payload']);

    return new Promise((resolve, reject) => {
      this.handleAccountEventsResponse(resolve, reject);
      setTimeout(() => {
        //TODO: Throw an exception here with UME patterns
        reject('Timeout error');
      }, 5000);
    });
  }

  private handleAccountEventsResponse(resolve, reject) {
    this.eventEmitter.on('created_account', (payload) => {
      resolve(payload);
    });

    this.eventEmitter.on('account_error', (error) => {
      reject(error);
    });
  }
}
