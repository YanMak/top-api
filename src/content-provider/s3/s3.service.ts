import { Injectable } from '@nestjs/common';
import * as AWS from 'aws-sdk';

@Injectable()
export class S3Service {
  AWS_S3_BUCKET = process.env.S3_BUCKET_NAME;
  s3 = new AWS.S3({
    accessKeyId: process.env.S3_ACCESS_KEY,
    secretAccessKey: process.env.S3_SECRET_KEY,
    endpoint: process.env.S3_ENDPOINT_URL,
  });

  async uploadFile(file) {
    const { originalname } = file;

    console.log(`originalname=${originalname} file.mimetype=${file.mimetype}`);

    await this.s3_upload(
      file.buffer,
      this.AWS_S3_BUCKET,
      originalname,
      file.mimetype,
    );
  }

  async uploadBuffer(
    buffer: Buffer,
    originalname: string,
    mimetype = 'image/webp',
  ) {
    console.log(`originalname=${originalname} file.mimetype=${mimetype}`);
    await this.s3_upload(buffer, this.AWS_S3_BUCKET, originalname, mimetype);
  }

  async s3_upload(file, bucket, name, mimetype) {
    const params = {
      Bucket: bucket,
      Key: String(name),
      Body: file,
      ACL: 'public-read',
      ContentType: mimetype,
      ContentDisposition: 'inline',
      CreateBucketConfiguration: {
        LocationConstraint: 'ru-msk',
      },
    };

    console.log(params);

    try {
      let s3Response = await this.s3.upload(params).promise();

      console.log(s3Response);
    } catch (e) {
      console.log(e);
    }
  }
}
