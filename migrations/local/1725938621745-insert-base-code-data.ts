import { MigrationInterface, QueryRunner } from 'typeorm';

export class InsertBaseCodeData1725938621745 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // queue_state 코드성 데이터 추가
    await queryRunner.query(`
        INSERT INTO queue_state
        (code, name, createdAt, updatedAt, deletedAt)
        VALUES
            ('Hold', '대기', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, null),
            ('Fail', '실패', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, null),
            ('Success', '성공', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, null)
        ;
        `);

    // domain_type 코드성 데이터 추가
    await queryRunner.query(`
        INSERT INTO domain_type
        (code, name, createdAt, updatedAt, deletedAt)
        VALUES
            ('Post', '게시물', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, null),
            ('Comment', '댓글', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, null),
            ('Reply', '대댓글', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, null)
        ;
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // queue_state 코드성 데이터 삭제
    await queryRunner.query(
      `DELETE FROM queue_state WHERE code IN('Hold', 'Fail', 'Success') ;`,
    );
    // domain_type 코드성 데이터 삭제
    await queryRunner.query(
      `DELETE FROM domain_type WHERE code IN('Post', 'Comment', 'Reply') ;`,
    );
  }
}
