import { applyDecorators } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
} from '@nestjs/swagger';

import { ErrorMessage, SuccessMessage } from '@app/common';
import { CommentController } from '../comment.controller';
import {
  GetCommentsResponseWithTotalCount,
  GetRepliesResponseWithTotalCount,
} from '../dto';

type API_DOC_TYPE = keyof CommentController;

// eslint-disable-next-line @typescript-eslint/ban-types
const decorators: Record<API_DOC_TYPE, Function> = {
  getComments: () =>
    applyDecorators(
      ApiOperation({ summary: '댓글 리스트 조회' }),
      ApiOkResponse({
        description: SuccessMessage.S200_APP_OK,
        type: GetCommentsResponseWithTotalCount,
      }),
      ApiBadRequestResponse({
        description: ErrorMessage.E400_APP_BAD_REQUEST,
      }),
    ),
  createComment: () =>
    applyDecorators(
      ApiOperation({ summary: '댓글 생성' }),
      ApiNoContentResponse({
        description: SuccessMessage.S204_APP_NO_CONTENT,
      }),
      ApiBadRequestResponse({
        description: ErrorMessage.E400_APP_BAD_REQUEST,
      }),
      ApiNotFoundResponse({
        description: ErrorMessage.E404_COMMENT_CREATE_COMMENT_NOT_FOUND_POST,
      }),
    ),
  getReplies: () =>
    applyDecorators(
      ApiOperation({ summary: '답글 리스트 조회' }),
      ApiOkResponse({
        description: SuccessMessage.S200_APP_OK,
        type: GetRepliesResponseWithTotalCount,
      }),
      ApiBadRequestResponse({
        description: ErrorMessage.E400_APP_BAD_REQUEST,
      }),
      ApiNotFoundResponse({
        description: ErrorMessage.E404_COMMENT_GET_REPLIES_NOT_FOUND_COMMENT,
      }),
    ),
  createReply: () =>
    applyDecorators(
      ApiOperation({ summary: '답글 생성' }),
      ApiNoContentResponse({
        description: SuccessMessage.S204_APP_NO_CONTENT,
      }),
      ApiBadRequestResponse({
        description: ErrorMessage.E400_APP_BAD_REQUEST,
      }),
      ApiNotFoundResponse({
        description: ErrorMessage.E404_COMMENT_CREATE_REPLY_NOT_FOUND_COMMENT,
      }),
    ),
};

export const DocumentHelper = (docType: API_DOC_TYPE) => {
  return decorators[docType]();
};
