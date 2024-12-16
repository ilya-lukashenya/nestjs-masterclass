import { Injectable, RequestTimeoutException } from '@nestjs/common';

import { ConfigService } from '@nestjs/config';
import { promises as fs } from 'fs';
import { join } from 'path'


@Injectable()
export class UploadLocalProvider {
  constructor(private readonly configService: ConfigService) {}
  

  public async fileupload(file: Express.Multer.File) {
    const savePath = this.configService.get('appConfig.savePath');
    const filePath = join(savePath, file.originalname);
    try{
        await fs.writeFile(filePath, file.buffer);
    }
    catch(error) {
        throw new RequestTimeoutException(error);
    }
    return filePath;
  }
}