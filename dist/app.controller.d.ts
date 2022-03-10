import { AppService } from './app.service';
export declare class AppController {
    private readonly appService;
    constructor(appService: AppService);
    getHello(): string;
    handleRequestEvent(res: any, eventMessage: string): Promise<void>;
}
