import { ConfigService } from '@nestjs/config';
import {
  BadRequestException,
  ConflictException,
  Injectable,
} from '@nestjs/common';
import { UploadFile } from '../interfaces/upload-file.interface';
import { UploadToAwsProvider } from './upload-to-aws.provider';
import { fileTypes } from '../enums/file-types.enum';
import { InjectRepository } from '@nestjs/typeorm';
import { Upload } from '../upload.entity';
import { Repository } from 'typeorm';
import { UploadLocalProvider } from './local-upload.provider';
@Injectable()
export class UploadsService {
  constructor(
    private readonly uploadToAwsProvider: UploadToAwsProvider,

    private readonly configService: ConfigService,
 
    @InjectRepository(Upload)
    private uploadsRepository: Repository<Upload>,

    private readonly uploadLocalProvider: UploadLocalProvider,
  ) {}
  public async uploadFile(file: Express.Multer.File) {
    if (
      !['image/gif', 'image/jpeg', 'image/jpg', 'image/png'].includes(
        file.mimetype,
      )
    ) {
      throw new BadRequestException('MIME type not supported');
    }

    try {
      const path = await this.uploadToAwsProvider.fileupload(file);
      const uploadFile: UploadFile = {
        name: path,
        path: `C:\\Projects\\${path}`,
        type: fileTypes.IMAGE,
        mime: file.mimetype,
        size: file.size,
      };
      const upload = this.uploadsRepository.create(uploadFile);
      return await this.uploadsRepository.save(upload);
    } catch (error) {
      throw new ConflictException(error);
    }
  }

  public async uploadFileLocal(file: Express.Multer.File) {
    if (
      !['image/gif', 'image/jpeg', 'image/jpg', 'image/png'].includes(
        file.mimetype,
      )
    ) {
      throw new BadRequestException('MIME type not supported');
    }

    try {
      const filePath = await this.uploadLocalProvider.fileupload(file);

      const uploadFile: UploadFile = {
        name: file.originalname,
        path: filePath,
        type: fileTypes.IMAGE,
        mime: file.mimetype,
        size: file.size,
      };
      const upload = this.uploadsRepository.create(uploadFile);
      return await this.uploadsRepository.save(upload);
    } catch (error) {
      throw new ConflictException(error);
    }
  }
}