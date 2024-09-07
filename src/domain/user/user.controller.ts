import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  HttpCode,
  Patch,
  Post,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';

import { ApiControllerDocument, GetUserInfoDecorator } from '@app/common';
import { DocumentHelper } from './document/document.decorator';
import {
  GetUserResponseDTO,
  PatchUserRequestDTO,
  PostUserRequestDTO,
  PostUserResponseDTO,
} from './dto';
import { JwtGuard } from '../auth/guard';
import { UserServiceUseCase } from './user.service';

@ApiControllerDocument('users API')
@Controller('/users')
@UseInterceptors(ClassSerializerInterceptor)
export class UserController {
  constructor(private readonly userService: UserServiceUseCase) {}

  @DocumentHelper('postUsers')
  @Post()
  @HttpCode(201)
  async postUsers(
    @Body() postDto: PostUserRequestDTO,
  ): Promise<PostUserResponseDTO> {
    return this.userService.createUser(postDto);
  }

  @DocumentHelper('getUser')
  @UseGuards(JwtGuard)
  @Get('/me')
  async getUser(
    @GetUserInfoDecorator('uid') userId: string,
  ): Promise<GetUserResponseDTO> {
    return this.userService.getUser(userId);
  }

  @DocumentHelper('patchUser')
  @UseGuards(JwtGuard)
  @Patch('/me')
  @HttpCode(204)
  async patchUser(
    @GetUserInfoDecorator('uid') userId: string,
    @Body() postDto: PatchUserRequestDTO,
  ): Promise<void> {
    await this.userService.updateUser(userId, postDto);
  }

  @DocumentHelper('deleteUser')
  @UseGuards(JwtGuard)
  @Delete('/me')
  @HttpCode(204)
  async deleteUser(@GetUserInfoDecorator('uid') userId: string): Promise<void> {
    await this.userService.softRemoveUser(userId);
  }
}
