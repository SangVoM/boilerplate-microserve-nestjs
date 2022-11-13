import { ConsumerDeserializer, IncomingRequest } from '@nestjs/microservices';
import { Logger } from '@nestjs/common';

export class InboundMessageIdentityDeserializer
  implements ConsumerDeserializer
{
  private readonly logger = new Logger('InboundMessageIdentityDeserializer');

  deserialize(value: any, options?: Record<string, any>): IncomingRequest {
    this.logger.debug(`${JSON.stringify({ ...options, ...value })}`);
    return value;
  }
}
