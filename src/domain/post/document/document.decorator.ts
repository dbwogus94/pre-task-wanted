import { applyDecorators } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiConflictResponse,
  ApiNoContentResponse,
  ApiOkResponse,
  ApiOperation,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

import { ErrorMessage, SuccessMessage } from '@app/common';
import { PostController } from '../post.controller';
import { GetPostResponse, GetPostsResponseWithTotalCount } from '../dto';

type API_DOC_TYPE = keyof PostController;

// eslint-disable-next-line @typescript-eslint/ban-types
const decorators: Record<API_DOC_TYPE, Function> = {
  getPosts: () =>
    applyDecorators(
      ApiOperation({ summary: '게시물 리스트 조회' }),
      ApiOkResponse({
        description: SuccessMessage.S200_APP_OK,
        type: GetPostsResponseWithTotalCount,
      }),
      ApiBadRequestResponse({
        description: ErrorMessage.E400_APP_BAD_REQUEST,
      }),
      ApiConflictResponse({
        description: ErrorMessage.E409_POST_TITLE_AND_AUTHOR_CONFLICT,
      }),
    ),
  createPost: () =>
    applyDecorators(
      ApiOperation({ summary: '게시물 생성' }),
      ApiNoContentResponse({
        description: SuccessMessage.S204_APP_NO_CONTENT,
      }),
      ApiBadRequestResponse({
        description: ErrorMessage.E400_APP_BAD_REQUEST,
      }),
    ),
  getPost: () =>
    applyDecorators(
      ApiOperation({ summary: '게시물 조회' }),
      ApiOkResponse({
        description: SuccessMessage.S200_APP_OK,
        type: GetPostResponse,
      }),
      ApiBadRequestResponse({
        description: ErrorMessage.E400_APP_BAD_REQUEST,
      }),
    ),
  putPost: () =>
    applyDecorators(
      ApiOperation({ summary: '게시물 수정' }),
      ApiNoContentResponse({
        description: SuccessMessage.S204_APP_NO_CONTENT,
      }),
      ApiBadRequestResponse({
        description: ErrorMessage.E400_APP_BAD_REQUEST,
      }),
      ApiUnauthorizedResponse({
        description: ErrorMessage.E401_APP_UNAUTHORIZED,
      }),
    ),
  deletePost: () =>
    applyDecorators(
      ApiOperation({ summary: '게시물 삭제' }),
      ApiNoContentResponse({
        description: SuccessMessage.S204_APP_NO_CONTENT,
      }),
      ApiBadRequestResponse({
        description: ErrorMessage.E400_APP_BAD_REQUEST,
      }),
      ApiUnauthorizedResponse({
        description: ErrorMessage.E401_APP_UNAUTHORIZED,
      }),
    ),
};

export const DocumentHelper = (docType: API_DOC_TYPE) => {
  return decorators[docType]();
};
