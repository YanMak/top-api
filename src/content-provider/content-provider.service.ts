import { Injectable } from '@nestjs/common';
import { FileElementResponse } from '../dtos/file-element.response';
import { format } from 'date-fns';
import { path } from 'app-root-path';
import { ensureDir, writeFile } from 'fs-extra';
//import sharp from 'sharp'
import * as sharp from 'sharp';
import { v4 as uuidv4 } from 'uuid';
import { FILE_EXTENSION, UPLOADS_PATH } from './constants';
import { S3Service } from './s3/s3.service';
import { FileConvertService } from './file-convert-service/file-convert.service';

@Injectable()
export class ContentProviderService {
  constructor(
    private readonly s3Service: S3Service,
    private readonly fileConvertService: FileConvertService,
  ) {}

  async saveFile(
    files: Express.Multer.File[],
    category: string,
    needToConvertToWebp: boolean = false,
    oldName: string = '',
  ): Promise<FileElementResponse[]> {
    const dateFolder = format(new Date(), 'yyyy-MM-dd');
    const uploadFolder = `${path}/${UPLOADS_PATH}/${dateFolder}`;
    console.log('path:');
    console.log(path);
    await ensureDir(uploadFolder);
    const res: FileElementResponse[] = [];
    for (const file of files) {
      //const { buffer, ...rest } = file;
      //console.log(rest);
      let short_filename = file.originalname;
      if (!oldName) {
        short_filename = `${this.generateUUID()}`;
      }

      let filename = '';
      const this_FILE_EXTENSION = 'jpg';
      if (needToConvertToWebp) {
        filename = `${uploadFolder}/${short_filename}.${FILE_EXTENSION}`;
      } else {
        filename = `${uploadFolder}/${short_filename}.${this_FILE_EXTENSION}`;
      }

      if (needToConvertToWebp) {
        await writeFile(filename, await this.convertToWebp(file.buffer));
      } else {
        console.log(filename);
        await writeFile(filename, file.buffer);
      }

      res.push({
        url: filename,
        name: short_filename,
        extension: FILE_EXTENSION,
        category,
      });
    }
    return res;
  }

  //async convertToWebp(image: Express.Multer.File, image2: Buffer): Promise<Buffer> {
  async convertToWebp(image: Buffer): Promise<Buffer> {
    //const options: sharp.SharpOptions = {};
    const res = await sharp(image.buffer).webp().toBuffer();
    return res;
  }

  async convertToWebp_archive(image: Express.Multer.File): Promise<Buffer> {
    //const options: sharp.SharpOptions = {};
    const res = await sharp(image.buffer).webp().toBuffer();
    return res;
  }

  generateUUID(): string {
    return uuidv4();
  }
}
