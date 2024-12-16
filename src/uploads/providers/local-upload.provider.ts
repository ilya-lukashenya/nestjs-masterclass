import * as path from 'path';

import { Injectable, RequestTimeoutException } from '@nestjs/common';

import { ConfigService } from '@nestjs/config';
import { Express } from 'express';
import { v4 as uuidv4 } from 'uuid';
import multer from 'multer';
import { promises as fs } from 'fs';
import { join } from 'path'
import { error } from 'console';

@Injectable()
export class UploadLocalProvider {
  constructor(private readonly configService: ConfigService) {}
  

  public async fileupload(file: Express.Multer.File) {
    const savePath = 'C:\\Projects\\nestjs-masterclass\\src\\uploads\\savedUploads\\';
    const filePath = join(savePath, file.originalname);
    try{
        await fs.writeFile(filePath, file.buffer);
    }
    catch(error) {
        throw new RequestTimeoutException(error);
    }

  }
}