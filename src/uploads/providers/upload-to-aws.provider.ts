import * as path from 'path';

import { Injectable, RequestTimeoutException } from '@nestjs/common';

import { ConfigService } from '@nestjs/config';
import { S3 } from 'aws-sdk';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class UploadToAwsProvider {
  constructor(private readonly configService: ConfigService) {}
  

  public async fileupload(file: Express.Multer.File) {
    const s3 = new S3();
    let uploadResult;
    try {
      uploadResult = await s3
        .upload({
          Bucket: this.configService.get<string>('appConfig.awsBucketName'),
          Body: file.buffer,
          Key: this.generateFileName(file),
          ContentType: file.mimetype,
        })
        .promise(); // Promisify the request

      // Return the file name
      return uploadResult.Key;
    } catch (error) {
      throw new RequestTimeoutException(error);
    }
  }

  private generateFileName(file: Express.Multer.File) {
    let name = file.originalname.split('.')[0];
    name.replace(/\s/g, '').trim();
    let extension = path.extname(file.originalname);
    let timeStamp = new Date().getTime().toString().trim();
    return `${name}-${timeStamp}-${uuidv4()}${extension}`;
  }
}