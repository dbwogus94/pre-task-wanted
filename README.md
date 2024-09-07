# nestjs 보일러 플레이트 

## 권장 환경
- node: v18.14.x
- nestjs 버전: v10.x.x
- @nestjs/cli: v10.1.17

## 폴더 구조
```bash
.
├── app.controller.ts
├── app.module.ts           # app 메인 Module           
├── app.service.ts
├── common                  # '@app/common'로 paths 설정
├── config                   # '@app/config'로 paths 설정
├── custom                  # '@app/custom'로 paths 설정
│   ├── express             # express 관련. EX. middleware 
│   └── nest                # nestjs 관련. EX. interceptor, provider
├── domain                  # 모든 API는 domain 모듈 하위 모듈로 구현한다.
│   └── domain.module.ts
├── entity                  # '@app/entity'로 paths 설정, typeorm entity 전용
│
└── main.ts                 # 주 진입점
```

## env 파일
- 참고: .env.sample
```
NODE_ENV=local

## app
TZ=Asia/Seoul
PORT=3000
CORS_ORIGIN=*
APP_NAME='API'

JWT_SECRET=jwt-secret
JWT_EXPIRES_IN=7d
JWT_ISSUER=Nest-API
JWT_SUBJECT=user-info

## TypeORM
DATABASE_TYPE=postgres
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_NAME=postgres
DATABASE_USER=
DATABASE_PASSWORD=
DATABASE_LOG=all
#DATABASE_LOG=query,info,warn,error
DATABASE_MAX_QUERY_EXECUTION_TIME=10000

## (optional) connection custom setting
DATABASE_CONNECT_TIMEOUT=60000
DATABASE_POOL_MIN_SIZE=5
DATABASE_POOL_MAX_SIZE=10

## swagger
SWAGGER_APIS_TITLE='Nestjs API'
SWAGGER_APIS_DESCRIPTION='Nestjs API'
SWAGGER_APIS_VERSION=1.0

## sentry
SENTRY_DSN=https://
SENTRY_TRACES_SAMPLE_RATE=0.7

## Slack Server Error
SLACK_WEB_HOOK_URI_BY_SERVER_ERROR_ALERT=
SLACK_CHANNEL_NAME_BY_SERVER_ERROR_ALERT=error-alaram
SLACK_DESCRIPTION_BY_SERVER_ERROR_ALERT=server-error-alaram-channel
SLACK_VIEWER_URL_BY_SERVER_ERROR_ALERT=https://

```

## 프로젝트 실행 방법
1. npm 모듈 설치 
```bash
# package.json 기준으로 설치
$ npm install

# package-lock.json 기준으로 설치
$ npm ci
```

2. 개발환경에 사용할 env 파일 생성 및 설정 값 추가
```bash
$ cp .env.sample ./env/local.env
```

3. 개발 환경으로 실행
```bash
# watch 모드로 실행
$ npm run start:dev

# 디버그 모드로 실행
$ npm run start:debug
```   

4. 확인
- api: [localhost:3000/api](http://localhost:3000/api)
- swagger: [localhost:3000/docs](http://localhost:3000/docs)
- swagger-json: [localhost:3000/docs-json](http://localhost:3000/docs-json)

5. (optional) husky 설정
```bash
# husky 초기화
npm run prepare 
```