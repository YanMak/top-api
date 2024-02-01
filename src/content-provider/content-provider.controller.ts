import {
  Controller,
  Get,
  HttpCode,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Express } from 'express';
import { FileElementResponse } from '../dtos/file-element.response';
import { ContentProviderService } from './content-provider.service';
import { S3Service } from './s3/s3.service';
import { FileConvertService } from './file-convert-service/file-convert.service';

@Controller('content-service')
export class ContentProviderController {
  constructor(
    private readonly fileService: ContentProviderService,
    private readonly s3Service: S3Service,
    private readonly fileConvertService: FileConvertService,
  ) {}

  @Get('ping')
  ping() {
    return { message: 'Hello INCITY API' };
  }

  @Post('upload')
  @HttpCode(200)
  @UseInterceptors(FileInterceptor('files'))
  async uploadFile(
    @UploadedFile() file: Express.Multer.File,
  ): Promise<FileElementResponse[]> {
    const res = await this.fileService.saveFile([file], 'media', false);
    const buffer_sharp = await this.fileConvertService.convertToWebp(
      file.buffer,
    );
    console.log('file');
    console.log(file);
    console.log('saved file');
    console.log(res);
    //const res3 = await this.s3Service.uploadFile(file);
    const [originalname] = file.originalname.split('.');
    await this.s3Service.uploadBuffer(
      buffer_sharp,
      originalname + '_sharp.webp',
    );

    //await this.fileConvertService.convertToWebpTinifyFromfile(res[0].url);

    /*
    const buffer_tinify = await this.fileConvertService.convertToWebpTinify(
      file.buffer,
    );
    console.log('converted with tinify');
    const res_tinify = await this.s3Service.uploadBuffer(
      buffer_tinify,
      originalname + '_tinify.webp',
    );
    //console.log(res);*/
    return res;
  }
}
