import { Injectable, Inject, HttpException, HttpStatus } from '@nestjs/common';
import { MyLogger } from './logger/my-logger';

@Injectable()
export class AppService {
  @Inject(MyLogger)
  private logger: MyLogger;

  getHello(): string {
    this.logger.info('getHello info!', AppService.name);
    this.logger.warn('getHello warn!', AppService.name);
    this.logger.error('getHello error!', AppService.name);
    return 'Hello World!';
  }

  getHello2(): string {
    throw new HttpException(
      'getHello2() 请求异常',
      HttpStatus.EXPECTATION_FAILED
    );
  }
}
