import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import { ApiModule } from './api/api.module';
import { LoggingInterceptor } from './common/modules/logger/logging.interceptor';
import { APP_PORT, APP_VERSION, isApiMode, isSyncMode } from './env';
import { SyncModule } from './sync/sync.module';
import { DtoValidationPipe } from './validation/dto-validation.pipe';

const logger = new Logger();

async function bootstrap() {
    let module: typeof ApiModule;

    if (isApiMode) {
        module = ApiModule;
        logger.log('Server up as api');
    }

    if (isSyncMode) {
        module = SyncModule;
        logger.log('Server up as sync');
    }

    if (!module) {
        logger.error("Mode doesn't set. Please set server mode");
        process.exit(0);
    }

    const app = await NestFactory.create<NestExpressApplication>(module);

    app.enableShutdownHooks();

    if (isApiMode) {
        app.disable('x-powered-by');
        app.enableCors();
        app.useGlobalPipes(new DtoValidationPipe());
        app.useGlobalInterceptors(new LoggingInterceptor());

        const config = new DocumentBuilder()
            .setTitle('Abracadabra NFT')
            .setDescription('Abracadabra NFT api description')
            .setVersion(APP_VERSION)
            .build();

        const document = SwaggerModule.createDocument(app, config);
        SwaggerModule.setup('doc', app, document);
    }

    await app.listen(APP_PORT);
}
bootstrap();
