import { ErrorMessage } from '@app/common/message';
import { applyDecorators } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiNotFoundResponse,
  ApiTags,
} from '@nestjs/swagger';

export const ApiControllerDocument = (apiTag: string) => {
  return applyDecorators(
    ApiTags(apiTag),
    ApiBadRequestResponse({ description: ErrorMessage.E400_APP_BAD_REQUEST }),
    ApiNotFoundResponse({ description: ErrorMessage.E404_APP_NOT_FOUND }),
  );
};
