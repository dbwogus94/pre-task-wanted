import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitTable1725910936779 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // post 테이블 생성
    await queryRunner.query(`
            CREATE TABLE post (
                id BIGINT NOT NULL AUTO_INCREMENT COMMENT 'ID',
                createdAt datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '생성일',
                updatedAt datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '수정일',
                deletedAt datetime DEFAULT NULL COMMENT '삭제일',
                title VARCHAR(255) NOT NULL COMMENT '제목',
                content TEXT NOT NULL COMMENT '본문',
                authorName VARCHAR(100) NOT NULL COMMENT '작성자 이름',
                password VARCHAR(255) NOT NULL COMMENT '비밀번호',
                PRIMARY KEY (id),
                FULLTEXT INDEX ft_index_post_title (title) WITH PARSER ngram,
                FULLTEXT INDEX ft_index_post_title_content (title, content) WITH PARSER ngram
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
        `);

    // comment 테이블 생성
    await queryRunner.query(`
            CREATE TABLE comment (
                id BIGINT NOT NULL AUTO_INCREMENT COMMENT 'ID',
                createdAt datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '생성일',
                updatedAt datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '수정일',
                deletedAt datetime DEFAULT NULL COMMENT '삭제일',
                postId BIGINT NOT NULL COMMENT '게시물 id',
                content TEXT NOT NULL COMMENT '댓글 내용',
                authorName VARCHAR(100) NOT NULL COMMENT '댓글 작성자 이름',
                parentId BIGINT NOT NULL DEFAULT 0 COMMENT '부모 댓글 id, 0: 최상위 댓글',
                depth INT NOT NULL DEFAULT 0 COMMENT '댓글 깊이, 0: 최상위 댓글',
                isChild TINYINT NOT NULL DEFAULT 0 COMMENT '자식 댓글 존재 유무',
                PRIMARY KEY (id),
                CONSTRAINT fk_comment_post FOREIGN KEY (postId) REFERENCES post (id),
                KEY index_comment_parent_id (parentId),
                FULLTEXT INDEX ft_index_comment_content (content) WITH PARSER ngram
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
        `);

    // keyword 테이블 생성
    await queryRunner.query(`
            CREATE TABLE keyword (
                id BIGINT NOT NULL AUTO_INCREMENT COMMENT 'ID',
                createdAt datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '생성일',
                updatedAt datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '수정일',
                deletedAt datetime DEFAULT NULL COMMENT '삭제일',
                name VARCHAR(100) NOT NULL COMMENT '키워드 명',
                PRIMARY KEY (id),
                UNIQUE KEY (name)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
        `);

    // user_keyword 테이블 생성
    await queryRunner.query(`
            CREATE TABLE user_keyword (
                id BIGINT NOT NULL AUTO_INCREMENT COMMENT 'ID',
                createdAt datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '생성일',
                updatedAt datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '수정일',
                deletedAt datetime DEFAULT NULL COMMENT '삭제일',
                authorName VARCHAR(100) NOT NULL COMMENT '키워드 등록자',
                PRIMARY KEY (id),
                UNIQUE KEY (authorName)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
        `);

    // user_keyword_association 테이블 생성
    await queryRunner.query(`
            CREATE TABLE user_keyword_association (
                id BIGINT NOT NULL AUTO_INCREMENT COMMENT 'ID',
                createdAt datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '생성일',
                updatedAt datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '수정일',
                deletedAt datetime DEFAULT NULL COMMENT '삭제일',
                userKeywordId BIGINT NOT NULL COMMENT 'user_keyword id',
                keywordId BIGINT NOT NULL COMMENT 'keyword id',
                PRIMARY KEY (id),
                CONSTRAINT fk_user_keyword_association_user_keyword FOREIGN KEY (userKeywordId) REFERENCES user_keyword (id),
                CONSTRAINT fk_user_keyword_association_keyword FOREIGN KEY (keywordId) REFERENCES keyword (id),
                UNIQUE KEY (userKeywordId, keywordId)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
        `);

    // domain_type 테이블 생성
    await queryRunner.query(`
            CREATE TABLE domain_type (
                code varchar(100) NOT NULL COMMENT '코드',
                name varchar(100) NOT NULL COMMENT '코드명',
                createdAt datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '생성일',
                updatedAt datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '수정일',
                deletedAt datetime DEFAULT NULL COMMENT '삭제일',
                PRIMARY KEY (code)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
        `);

    // queue_state 테이블 생성
    await queryRunner.query(`
            CREATE TABLE queue_state (
                code varchar(100) NOT NULL COMMENT '코드',
                name varchar(100) NOT NULL COMMENT '코드명',
                createdAt datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '생성일',
                updatedAt datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '수정일',
                deletedAt datetime DEFAULT NULL COMMENT '삭제일',
                PRIMARY KEY (code)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
        `);

    // create_event_queue 테이블 생성
    await queryRunner.query(`
            CREATE TABLE create_event_queue (
                id BIGINT NOT NULL AUTO_INCREMENT COMMENT 'ID',
                createdAt datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '생성일',
                updatedAt datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '수정일',
                deletedAt datetime DEFAULT NULL COMMENT '삭제일',
                stateCode varchar(100) NOT NULL COMMENT 'queue 상태 CODE',
                domainId BIGINT NOT NULL COMMENT 'domain(게시물, 댓글, 답글) id',
                domainTypeCode varchar(100) NOT NULL COMMENT 'domain 타입 CODE',
                PRIMARY KEY (id),
                CONSTRAINT fk_create_event_queue_domain_type FOREIGN KEY (domainTypeCode) REFERENCES domain_type (code),
                CONSTRAINT fk_create_event_queue_state FOREIGN KEY (stateCode) REFERENCES queue_state (code),
                UNIQUE KEY (domainId, domainTypeCode)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
        `);

    // notification_queue 테이블 생성
    await queryRunner.query(`
            CREATE TABLE notification_queue (
                id BIGINT NOT NULL AUTO_INCREMENT COMMENT 'ID',
                createdAt datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '생성일',
                updatedAt datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '수정일',
                deletedAt datetime DEFAULT NULL COMMENT '삭제일',
                stateCode varchar(100) NOT NULL COMMENT 'queue 상태 CODE',
                domainId BIGINT NOT NULL COMMENT 'domain(게시물, 댓글, 답글) id',
                domainTypeCode varchar(100) NOT NULL COMMENT 'domain 타입 CODE',
                userKeywordId BIGINT NOT NULL COMMENT 'user_keyword id, FK 사용 x',
                PRIMARY KEY (id),
                CONSTRAINT fk_notification_queue_domain_type FOREIGN KEY (domainTypeCode) REFERENCES domain_type (code),
                CONSTRAINT fk_notification_queue_state FOREIGN KEY (stateCode) REFERENCES queue_state (code)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // 테이블 삭제 (생성의 역순으로 삭제)
    await queryRunner.query(`DROP TABLE IF EXISTS notification_queue;`);
    await queryRunner.query(`DROP TABLE IF EXISTS create_event_queue;`);
    await queryRunner.query(`DROP TABLE IF EXISTS queue_state;`);
    await queryRunner.query(`DROP TABLE IF EXISTS domain_type;`);
    await queryRunner.query(`DROP TABLE IF EXISTS user_keyword_association;`);
    await queryRunner.query(`DROP TABLE IF EXISTS user_keyword;`);
    await queryRunner.query(`DROP TABLE IF EXISTS keyword;`);
    await queryRunner.query(`DROP TABLE IF EXISTS comment;`);
    await queryRunner.query(`DROP TABLE IF EXISTS post;`);
  }
}
