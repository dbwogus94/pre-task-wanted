import { RestApiInstanceProperty, WithTotolCountResponse } from '@app/common';
import { BasePostResponse } from './base-response.dto';

export class GetPostsResponse extends BasePostResponse {}

export class GetPostsResponseWithTotalCount extends WithTotolCountResponse {
  @RestApiInstanceProperty(GetPostsResponse, {
    description: '게시물 리스트',
    isArray: true,
    arrayMinSize: 0,
  })
  results: GetPostsResponse[];
}
