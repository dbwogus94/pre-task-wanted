#!/bin/sh

# 인자 개수 체크
check_argument() {
  if [ "$#" -eq 0 ]; then 
    echo "1개의 인자가 필요합니다."
    exit 1
  fi
}

# 도움말 표시
display_help() {
  if [ "$1" == "--help" ] || [ "$1" == "-h" ]; then 
    echo "✅ nest module의 구성요소를 일괄적으로 생성하는 스크립트입니다.
    1. nest module를 생성할 위치로 경로(path)를 이동하세요.
    2. 스크립트를 실행하기 위해서는 인자를 하나 전달해야 합니다.
    3. 전달되는 인자는 nest cli에 사용되기 때문에 모두 소문자를 사용해야 하며, 띄어쓰기는 하이픈(-)을 사용합니다.
    
    ex) UserModule 생성 예시
    $ cd ./src/domain
    $ sh '<rootDir>/shell/create-module.sh' user
    $ tree user
    .
    ├── document
    │   ├── document.decorator.ts
    │   └── index.ts
    ├── domain
    │   ├── index.ts
    │   └── user.domain.ts
    ├── dto
    │   ├── index.ts
    │   ├── request
    │   │   └── index.ts
    │   └── response
    │       └── index.ts
    ├── user.controller.ts
    ├── user.module.ts
    ├── user.repository.ts
    └── user.service.ts
    "
    exit 1
  fi
}

# 슬래시 확인
check_slash_in_argument() {
  for arg in "$@"; do
    if [[ "$arg" == *"/"* ]]; then
      echo "인자에 '/'가 포함되어 있습니다. module을 생성할 위치로 이동하세요"
      exit 1
    fi
  done
}

# user-team -> UserItem
to_upper_camel() {
  uppercase() {
    echo "$1" | awk '{print toupper(substr($0, 1, 1)) tolower(substr($0, 2))}'
  } 
  # 문자열을 '-'로 분할하여 배열로 만들기
  IFS='-' read -ra words <<< "$1"

  # 각 단어의 첫 글자를 대문자로 변환
  for ((i=0; i<${#words[@]}; i++)); do
    words[i]=$(uppercase "${words[i]}")
  done

  # 배열의 단어들을 이어붙여서 카멜 케이스로 만들기
  camel_case=$(IFS=''; echo "${words[*]}")

  echo "$camel_case"
}