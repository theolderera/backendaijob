import { ConfigService } from '@nestjs/config';
export declare class UploadController {
    private readonly configService;
    constructor(configService: ConfigService);
    uploadPhoto(file: Express.Multer.File): {
        url: string;
    };
}
