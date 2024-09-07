import { IncomingWebhookSendArguments } from '@slack/webhook';
import type { KnownBlock, Block } from '@slack/types';
import { Request } from 'express';

import { DEFALUT_APP_NAME, DateUtil } from '@app/common';

type SlackBlock = KnownBlock | Block;
type Viewer = {
  /**
   * 모니터링을 위해 연결할 플랫폼 Url ex)sentry, aws
   */
  viewerUrl: string;
  /**
   * 플랫폼 연결 링크 a태그의 text 속성
   */
  viewerText: string;
};
type MessageOptions = {
  /**
   * 메시지 헤더
   */
  header: string;
  /**
   * 메시지 타입
   */
  type: 'Alert' | 'Error';
  /**
   * 메세지 발행 주체 ex)className
   */
  trigger: string;

  /**
   * 모니터링 플렛폼 정보
   */
  viewer?: Viewer;
};
type AlertMessageOptions = MessageOptions & {
  type: 'Alert';
};
type ErrorMessageOptions = MessageOptions & {
  type: 'Error';
  error: Error;
  request?: Request;
};

export class SlackTemplate {
  public static alertTemplate(
    options: AlertMessageOptions,
  ): IncomingWebhookSendArguments {
    const defaultBlocks = this.makeDefaultBlocks(options);
    return {
      blocks: [...defaultBlocks],
    };
  }

  public static errorTemplate(
    options: ErrorMessageOptions,
  ): IncomingWebhookSendArguments {
    const defaultBlocks = this.makeDefaultBlocks(options);
    const { error, request } = options;
    const { method, url, body } = request;
    return {
      blocks: [...defaultBlocks],
      attachments: [
        {
          color: 'danger',
          fields: [
            {
              title: `*Error Message*: ${error.message}`,
              value: '',
            },
            {
              title: ``,
              value: '```' + error.stack + '```',
              short: false,
            },
            {
              title: `*Error Request*: ${method} ${decodeURI(url)}`,
              value: '```' + JSON.stringify(body) + '```',
              short: false,
            },
          ],
        },
      ],
    };
  }

  private static makeDefaultBlocks(options: MessageOptions): SlackBlock[] {
    const { viewer } = options;
    return [
      {
        type: 'header',
        text: {
          type: 'plain_text',
          text: `[ ${process.env.NODE_ENV ?? 'local'} ] ${options.header}`,
          emoji: true,
        },
      },
      {
        type: 'section',
        fields: [
          {
            type: 'mrkdwn',
            text: `*Type:*\n- ${options.type}`,
          },
          {
            type: 'mrkdwn',
            text: `*Trigger:*\n- ${options.trigger}`,
          },
          {
            type: 'mrkdwn',
            text: `*Created:*\n- ${DateUtil.toFormat(new Date())}`,
          },
          {
            type: 'mrkdwn',
            text: viewer
              ? `*Viewer:*\n- <${viewer.viewerUrl}|${viewer.viewerText}>`
              : `*Created by:*\n- ${DEFALUT_APP_NAME.toLowerCase()}-api-server`,
          },
        ],
      },
      {
        type: 'section',
        fields: [
          {
            type: 'mrkdwn',
            text: `\n`,
          },
        ],
      },
    ];
  }

  private static makeViewerBlock(viewer: Viewer): SlackBlock {
    return {
      type: 'section',
      text: {
        type: 'mrkdwn',
        text: `<${viewer.viewerUrl}| 🔍 ${viewer.viewerText}>`,
      },
    };
  }
}
