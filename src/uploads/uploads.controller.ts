import { ApiHeaders, ApiOperation } from '@nestjs/swagger';
import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { Express } from 'express';
import { FileInterceptor } from '@nestjs/platform-express';
import { UploadsService } from './providers/uploads.service';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { AuthType } from 'src/auth/enums/auth-type.enum';
import { ConfigService } from '@nestjs/config';

@Auth(AuthType.None)
@Controller('uploads')
export class UploadsController {
  constructor(
    private readonly uploadsService: UploadsService,
    private readonly configService: ConfigService,
  ) {}

  // File is the field name
  @UseInterceptors(FileInterceptor('file'))
  @ApiHeaders([
    { name: 'Content-Type', description: 'multipart/form-data' },
    { name: 'Authorization', description: 'Bearer Token' },
  ])
  @ApiOperation({
    summary: `Upload a new image to the server`,
  })
  @Post('file')
  public uploadFile(@UploadedFile() file: Express.Multer.File) {
    const fileStorage = this.configService.get('appConfig.fileStorage');
    if(fileStorage =='aws') {
      return this.uploadsService.uploadFile(file);
    }
    return this.uploadsService.uploadFileLocal(file);
  }
}