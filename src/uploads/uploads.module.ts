import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Upload } from './upload.entity';
import { UploadToAwsProvider } from './providers/upload-to-aws.provider';
import { UploadsController } from './uploads.controller';
import { UploadsService } from './providers/uploads.service';
import { UploadLocalProvider } from './providers/local-upload.provider';

@Module({
  controllers: [UploadsController],
  providers: [UploadsService, UploadToAwsProvider, UploadLocalProvider],
  imports: [TypeOrmModule.forFeature([Upload])],
})
export class UploadsModule {}