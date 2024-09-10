import { RestApiDateProperty, RestApiStringProperty } from '../decorator';

export abstract class BaseResponse {
  @RestApiStringProperty({ description: '엔티티 id(bigint)', default: '1' })
  id: string;

  @RestApiDateProperty({ description: '생성일' })
  createdAt: Date;

  @RestApiDateProperty({ description: '수정일' })
  updatedAt: Date;
}
