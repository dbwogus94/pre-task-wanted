# nodejs 포지션 사전과제

## 권장 환경
- node: 20.15.x
- nestjs 버전: v10.x.x
- @nestjs/cli: v10.1.17

## 폴더 구조
```bash
.
├── app.controller.ts
├── app.service.ts
├── app.module.ts           # app 메인 Module           
├── domain                  # 모든 API는 domain 모듈 하위 모듈로 구현.
│   └── domain.module.ts
|
├── common                  # '@app/common'로 paths 설정, 공통 코드를 관리.
├── config                  # '@app/config'로 paths 설정, Config 클래스 관리.
├── custom                  # '@app/custom'로 paths 설정, 공통(전역) 프레임워크 관련 코드 관리.
│   ├── express             # express 관련. EX. middleware 
│   └── nest                # nestjs 관련. EX. interceptor, provider, pipe
├── entity                  # '@app/entity'로 paths 설정, typeorm entity를 관리
│
└── main.ts                 # nestjs 프로그램 주 진입점
```

## env 파일
- 참고: .env.sample
```
NODE_ENV=local

## app
TZ=Asia/Seoul
PORT=3000
# ex) CORS_ORIGIN=http://naver.com,http://map.naver.com,http://localhost:3000 
CORS_ORIGIN=*
APP_NAME='Pre-Task-Wanted'

## TypeORM
DATABASE_TYPE=postgres
DATABASE_HOST=
DATABASE_PORT=
DATABASE_NAME=
DATABASE_USER=
DATABASE_PASSWORD=
# ex) DATABASE_LOG=query,info,warn,error
DATABASE_LOG=all 
DATABASE_MAX_QUERY_EXECUTION_TIME=10000
DATABASE_CONNECTION_LIMIT=10

## swagger
SWAGGER_APIS_TITLE='Pre-Task-Wanted API'
SWAGGER_APIS_DESCRIPTION='Pre-Task-Wanted API'
SWAGGER_APIS_VERSION=1.0.0

```

## 프로젝트 실행 방법

#### 1. npm 모듈 설치 
```bash
## package.json 기준으로 설치
$ npm install

## package-lock.json 기준으로 설치
$ npm ci
```

#### 2. 개발환경 env 파일 생성 및 설정 값 추가
```bash
$ cp .env.sample ./env/local.env
```

#### 3. 테이블 생성 및 초기 데이터 추가
```bash
## typeorm migrate 파일에 있는 query를 일괄 실행 
$ npm run db:migrate:up
```

#### 4. 개발 환경으로 실행
```bash
## watch 모드로 실행
$ npm run start:dev

## 디버그 모드로 실행
$ npm run start:debug
```   

#### 5. 실행 확인
- api: [localhost:3000/api](http://localhost:3000/api)
- swagger: [localhost:3000/docs](http://localhost:3000/docs)
- swagger-json: [localhost:3000/docs-json](http://localhost:3000/docs-json)
