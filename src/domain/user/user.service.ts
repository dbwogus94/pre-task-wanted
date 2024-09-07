import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { AuthServiceUseCase } from '../auth/auth.service';
import {
  GetUserResponseDTO,
  PatchUserRequestDTO,
  PostUserRequestDTO,
  PostUserResponseDTO,
} from './dto';
import { UserRepositoryPort } from './user.repository';
import { ErrorMessage } from '@app/custom';
import { Util } from '@app/common';

export abstract class UserServiceUseCase {
  abstract createUser(
    postDto: PostUserRequestDTO,
  ): Promise<PostUserResponseDTO>;
  abstract getUser(userUid: string): Promise<GetUserResponseDTO>;
  abstract updateUser(
    userUid: string,
    postDto: PatchUserRequestDTO,
  ): Promise<void>;
  abstract softRemoveUser(userUid: string): Promise<void>;
}

@Injectable()
export class UserService extends UserServiceUseCase {
  constructor(
    @InjectDataSource()
    private readonly dataSource: DataSource,
    private readonly userRepo: UserRepositoryPort,
    private readonly authService: AuthServiceUseCase,
  ) {
    super();
  }

  async createUser(postDto: PostUserRequestDTO): Promise<PostUserResponseDTO> {
    const queryRunner = this.dataSource.createQueryRunner();
    const manager = queryRunner.manager;
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const txUserRepo = this.userRepo.createTransactionRepo(manager);
      const newUser = await txUserRepo.createOne(postDto);

      const token = this.authService.issueToken({
        uid: newUser.uid,
        id: newUser.id,
      });
      const nickname = postDto.nickname ?? newUser.generateNickname().nickname;
      const updateUser = await txUserRepo.updateOne(newUser, {
        token,
        nickname,
      });

      await queryRunner.commitTransaction();
      return Util.toInstance(PostUserResponseDTO, updateUser.props);
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async getUser(userUid: string): Promise<GetUserResponseDTO> {
    const user = await this.userRepo.findOneByPK(userUid);
    if (!user) throw new NotFoundException(ErrorMessage.E404_APP_NOT_FOUND);
    return Util.toInstance(GetUserResponseDTO, {
      ...user.props,
    });
  }

  async updateUser(
    userUid: string,
    postDto: PatchUserRequestDTO,
  ): Promise<void> {
    const user = await this.userRepo.findOneByPK(userUid);
    if (!user) throw new NotFoundException(ErrorMessage.E404_APP_NOT_FOUND);
    await this.userRepo.updateOneBy(userUid, { ...postDto });
  }

  async softRemoveUser(userUid: string): Promise<void> {
    const user = await this.userRepo.findOneByPK(userUid);
    if (!user) throw new NotFoundException(ErrorMessage.E404_APP_NOT_FOUND);
    await this.userRepo.softDelete(userUid);
  }
}
