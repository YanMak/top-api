import { Injectable } from '@nestjs/common';
//import sharp from 'sharp'
import * as sharp from 'sharp';
import tinify from 'tinify';
tinify.key = 'sQNRMpWQTHHKxWF3htG4CfdF4Vj8WGmm';

@Injectable()
export class FileConvertService {
  async convertToWebp(image: Buffer): Promise<Buffer> {
    //const options: sharp.SharpOptions = {};
    const res = await sharp(image.buffer)
      .resize(1000, 5000, { fit: 'inside' })
      .webp({ effort: 6 })
      .toBuffer();
    return res;
  }

  async convertToWebpTinifyFromBuffer(image: Buffer): Promise<Buffer> {
    const u8import = await new Uint8Array(image);
    const u8export = await tinify
      .fromBuffer(u8import)
      //.fromFile()
      .resize({
        method: 'fit',
        width: 1000,
        height: 5000,
      })
      .convert({ type: 'image/webp' })
      .toBuffer();
    return await Buffer.from(u8export);
  }

  async convertToWebpTinifyFromfile(filename: string): Promise<string> {
    const resized =
      '/Users/yan/code/playground/purpleshool/nest/top-api_/uploads/tinify-resized/tiny.webp';
    await tinify
      .fromFile(filename)
      //.fromFile()
      .resize({
        method: 'fit',
        width: 1000,
        height: 5000,
      })
      .convert({ type: 'image/webp' })
      .toFile(resized);
    return resized;
  }
}
