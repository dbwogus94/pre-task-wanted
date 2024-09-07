import { applyDecorators } from '@nestjs/common';
import { UserController } from '../user.controller';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiOkResponse,
  ApiOperation,
} from '@nestjs/swagger';
import { ErrorMessage, SuccessMessage } from '@app/custom';
import { GetUserResponseDTO, PostUserResponseDTO } from '../dto';
import { ApiAuthDocument, USER_ACCESS_TOKEN } from '@app/common';

type API_DOC_TYPE = keyof UserController;

// eslint-disable-next-line @typescript-eslint/ban-types
const decorators: Record<API_DOC_TYPE, Function> = {
  postUsers: () =>
    applyDecorators(
      ApiOperation({ summary: '(MVP 전용)유저 등록' }),
      ApiCreatedResponse({
        description: SuccessMessage.S201_USER_CREATED,
        type: PostUserResponseDTO,
      }),
      ApiBadRequestResponse({ description: ErrorMessage.E400_APP_BAD_REQUEST }),
    ),
  getUser: () =>
    applyDecorators(
      ApiAuthDocument(USER_ACCESS_TOKEN),
      ApiOperation({ summary: '유저 정보 조회' }),
      ApiOkResponse({
        description: SuccessMessage.S200_USER_OK,
        type: GetUserResponseDTO,
      }),
    ),
  patchUser: () =>
    applyDecorators(
      ApiAuthDocument(USER_ACCESS_TOKEN),
      ApiOperation({ summary: '유저 수정' }),
      ApiNoContentResponse({
        description: SuccessMessage.S204_USER_UPDATED,
      }),
    ),
  deleteUser: () =>
    applyDecorators(
      ApiAuthDocument(USER_ACCESS_TOKEN),
      ApiOperation({ summary: '유저 제거' }),
      ApiNoContentResponse({
        description: SuccessMessage.S204_USER_DELETED,
      }),
    ),
};

export const DocumentHelper = (docType: API_DOC_TYPE) => {
  return decorators[docType]();
};
