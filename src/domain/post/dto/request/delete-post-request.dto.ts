import { PickType } from '@nestjs/swagger';
import { BasePostRequest } from './base-request.dto';

export class DeletePostRequest extends PickType(BasePostRequest, [
  'password',
]) {}
