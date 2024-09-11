const UserSuccessMessage = {
  S200_USER_OK: '유저 정보 조회에 성공했습니다.',
  S201_USER_CREATED: '유저 등록에 성공했습니다.',
  S204_USER_UPDATED: '유저 수정에 성공했습니다.',
  S204_USER_DELETED: '유저 제거에 성공했습니다.',
};

// S${statusCode}_${도메인}_${변수명}
export const SuccessMessage = {
  S200_APP_OK: '응답에 성공했습니다.',
  S201_APP_CREATED: '생성에 성공했습니다.',
  S202_APP_ACCEPTED: '승인, 처리가 완료되지 않았습니다.',
  S204_APP_NO_CONTENT: '성공, 응답할 자원은 없습니다.',
  ...UserSuccessMessage,
};

const PostErrorMessage = {
  E409_POST_TITLE_AND_AUTHOR_CONFLICT:
    '제목과 작성자는 동시에 사용 불가합니다.',
};

const CommentErrorMessage = {
  E404_COMMENT_CREATE_COMMENT_NOT_FOUND_POST:
    '댓글 작성을 요청한 게시물이 존재하지 않습니다.',
  E404_COMMENT_GET_REPLIES_NOT_FOUND_COMMENT:
    '댓글이 존재하지 않아 답글을 조회할 수 없습니다.',
  E404_COMMENT_CREATE_REPLY_NOT_FOUND_COMMENT:
    '답글 작성을 요청한 댓글이 존재하지 않습니다.',
};

// E${statusCode}_${도메인}_${변수명}
export const ErrorMessage = {
  E400_APP_BAD_REQUEST: '요청이 유효성 검사를 통과하지 못했습니다.',
  E401_APP_UNAUTHORIZED: '인증 정보가 잘못되었습니다.',
  E402_APP_PAYMENT_REQUIRED: '요청한 자원에 접근하려면 결제가 필요합니다.',
  E403_APP_FORBIDDEN: '요청한 자원에 접근할 권한이 없습니다.',
  E404_APP_NOT_FOUND: '요청한 자원이 존재하지 않거나, 사용할 수 없습니다.',
  E409_APP_CONFLICT: '요청 처리중 충돌이 발생했습니다.',
  E415_APP_UNSUPPORTED_MEDIA_TYPE:
    '지원하지 않는 미디어 타입(mimetypes)입니다.',
  ...PostErrorMessage,
  ...CommentErrorMessage,
};
