import { Module } from '@nestjs/common';
import { ContentProviderService } from './content-provider.service';
import { ContentProviderController } from './content-provider.controller';
import { ServeStaticModule } from '@nestjs/serve-static';
import { UPLOADS_PATH } from './constants';
import { path } from 'app-root-path';
import { join } from 'path';
import { S3Service } from './s3/s3.service';
import { FileConvertService } from './file-convert-service/file-convert.service';

const curr_path = `${path}/${UPLOADS_PATH}`;
console.log(curr_path);
console.log(join(__dirname, '..', 'uploads'));

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: curr_path,
      //serveStaticOptions: { index: false },
      serveRoot: '/static/',
    }),
  ],
  /*imports: [
		ServeStaticModule.forRoot({
			rootPath: join(__dirname, '..', 'client'),
		}),
	],*/
  controllers: [ContentProviderController],
  providers: [ContentProviderService, S3Service, FileConvertService],
})
export class ContentProviderModule {}
