import { EventEmitter2 } from '@nestjs/event-emitter';
export declare class AppService {
    private eventEmitter;
    constructor(eventEmitter: EventEmitter2);
    getHello(): string;
    handlerEvents(eventMessage: string): Promise<any>;
    private handleAccountEventsResponse;
}
