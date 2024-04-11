/*!
 * Copyright 2021 WPPConnect Team
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/* eslint-disable simple-import-sort/exports */
/* eslint-disable simple-import-sort/imports */
import './config';
import './deviceName';
import './gtag';

import * as webpack from './webpack';
import * as whatsapp from './whatsapp';
import * as chat from './chat';
import * as contact from './contact';
import * as profile from './profile';
import * as status from './status';
import * as util from './util';

import {
  emit,
  emitAsync,
  eventNames,
  getMaxListeners,
  hasListeners,
  listenTo,
  listenerCount,
  listeners,
  listenersAny,
  many,
  off,
  offAny,
  on,
  onAny,
  once,
  prependAny,
  prependListener,
  prependMany,
  prependOnceListener,
  removeAllListeners,
  removeListener,
  setMaxListeners,
  stopListeningTo,
  waitFor,
} from './eventEmitter';

export { webpack };
export { isInjected, isReady, isFullReady } from './webpack';
export { whatsapp };
export { config, Config } from './config';

export * as blocklist from './blocklist';
export * as call from './call';
export * as catalog from './catalog';
// export * as chat from './chat';
export { chat };
export * as conn from './conn';
export { contact };
export * as ev from './eventEmitter';
export * as community from './community';
export * as group from './group';
export * as labels from './labels';
export { profile };
export { status };
export { util };
export * as newsletter from './newsletter';
export * as order from './order';

export {
  emit,
  emitAsync,
  eventNames,
  getMaxListeners,
  hasListeners,
  listenTo,
  listenerCount,
  listeners,
  listenersAny,
  many,
  off,
  offAny,
  on,
  onAny,
  once,
  prependAny,
  prependListener,
  prependMany,
  prependOnceListener,
  removeAllListeners,
  removeListener,
  setMaxListeners,
  stopListeningTo,
  waitFor,
};

declare const __VERSION__: string;
declare const __SUPPORTED_WHATSAPP_WEB__: string;
export const version = __VERSION__;
export const supportedWhatsappWeb = __SUPPORTED_WHATSAPP_WEB__;
export const license = 'Apache-2.0';

const getBodyText = (msg: whatsapp.MsgModel) => {
  switch (msg.type) {
    case 'chat':
      return msg.body || '';
    case 'image':
    case 'video':
    case 'audio':
    case 'ptt':
    case 'document':
      return `[${msg.type}]${msg.caption}`;
    default:
      return null;
  }
};

const getChatType = (kind: string) => {
  if (!kind) return 'private';
  switch (kind) {
    case 'chat':
      return 'private';
    default:
      return kind;
  }
};

const chatToFans = (
  contactModel: whatsapp.ChatModel | whatsapp.ContactModel
): any => {
  let nickname = '';
  if ('formattedTitle' in contactModel && contactModel.formattedTitle) {
    nickname = contactModel.formattedTitle;
  } else if ('contact' in contactModel) {
    nickname = contactModel.contact.pushname || contactModel.contact.name;
  } else if ('pushname' in contactModel) {
    nickname = contactModel.pushname || contactModel.name;
  }
  const avatarData = whatsapp.ProfilePicThumbStore.get(
    contactModel.id._serialized
  );

  let is_group = 0;
  try {
    is_group = contactModel.isGroup ? 1 : 0;
  } catch {}

  return {
    chat_user_id: contactModel.id._serialized,
    country:
      window._wpp.getCountryFromPhoneNumber(contactModel.id.user)
        ?.defaultName || '',
    from: 'chat',
    // img_url: avatar,
    ori_img_url: avatarData?.img,
    // @ts-ignore
    ori_img_key: avatarData?.filehash,
    is_group,
    nickname,
    phone: contactModel.id.user,
    username: contactModel.id.user,
  };
};

// window._DrawerManager;

webpack.injectLoader();

let __$propsName: string = '';
const getReactProps = (dom: any): any => {
  if (!__$propsName) {
    const keys = Object.keys(dom);
    for (const key of keys) {
      if (key.startsWith('__reactProps$')) {
        __$propsName = key;
        break;
      }
    }
  }
  const propsName = __$propsName;
  if (!propsName) return null;

  return dom[propsName];
};
let __$fiberName: string = '';
const getReactFiber = (dom: any): any => {
  if (!__$fiberName) {
    const keys = Object.keys(dom);
    for (const key of keys) {
      if (key.startsWith('__reactFiber$')) {
        __$fiberName = key;
        break;
      }
    }
  }
  const propsName = __$fiberName;
  if (!propsName) return null;

  return dom[propsName];
};

const disposeChatDom = (chatDom: Element) => {
  const props = getReactProps(chatDom);
  const id = props?.children?.key;
  // const id = model?.id?._serialized;
  if (!id) return;
  chatDom.setAttribute('chat-id', id);
  window._wpp.getRepeatFansInfoById(id);
  console.log([chatDom], id);
};

window._readCall = () => {
  // 开始重粉标记
  const observer = new MutationObserver((mutationsList) => {
    for (const mutation of mutationsList) {
      // @ts-ignore
      const addedNodes: HTMLElement[] = mutation.addedNodes;
      for (const addedNode of addedNodes) {
        if (
          addedNode?.getAttribute?.('role') === 'listitem' &&
          addedNode.querySelector('._ak8n ._ak8h > :not([class])')
        ) {
          disposeChatDom(addedNode);
        } else if (
          addedNode?.querySelector?.(
            '[role="listitem"] ._ak8n ._ak8h > :not([class])'
          )
        ) {
          addedNode
            .querySelectorAll('[role="listitem"] ._ak8n ._ak8h > :not([class])')
            .forEach((chatDom) => {
              disposeChatDom(chatDom);
            });
        } else if (
          addedNode?.parentElement?.className === '_ak8h' &&
          addedNode?.parentElement?.parentElement?.className === '_ak8n'
        ) {
          // console.log('addedNode', [addedNode]);
          disposeChatDom(addedNode);
        } else {
          // console.log('addedNode', [addedNode]);
        }
      }
    }
  });
  observer.observe(document.body, {
    attributes: false,
    childList: true,
    subtree: true,
  });

  document
    .querySelectorAll('[role="listitem"] ._ak8n ._ak8h > :not([class])')
    .forEach((chatDom) => {
      disposeChatDom(chatDom);
    });
  // 结束重粉标记

  // 准备完成后  工单登陆完毕
  // 初始化一次消息上报
  for (const msg of whatsapp.MsgStore.getModelsArray()) {
    const server = msg.from?.server;
    if (server !== 'c.us') continue;

    const bodyText = getBodyText(msg);
    if (!bodyText) continue;
    const t = msg.t ? msg.t * 1000 : 0;
    const data: any = {
      contacts_id: msg.id.remote._serialized,
      create_time: t,
      id: msg.id.id,
      init_text: bodyText,
      is_self: msg.id.fromMe ? 1 : 0,
      translate_text: '',
      success: 0,
      user_info_child_channel_id: 0, // 在App中处理
      child_id: 0, // 以前的好像和 user_info_child_channel_id 是一样的
      server,
      isGroupMsg: msg.isGroupMsg || msg.id.remote.isGroup(),
    };
    window._wpp.uploadMessage(data);
  }
  // 通过此事件监听新消息 可以监听到滚动历史的
  whatsapp.MsgStore.on('add', (msg: whatsapp.MsgModel) => {
    const server = msg.from?.server;
    if (server !== 'c.us') return;

    const bodyText = getBodyText(msg);
    if (!bodyText) return;
    const t = msg.t ? msg.t * 1000 : 0;

    const data: any = {
      contacts_id: msg.id.remote._serialized,
      create_time: t,
      id: msg.id.id,
      init_text: bodyText,
      is_self: msg.id.fromMe ? 1 : 0,
      translate_text: '',
      success: 0,
      user_info_child_channel_id: 0, // 在App中处理
      child_id: 0, // 以前的好像和 user_info_child_channel_id 是一样的
      server,
      isGroupMsg: msg.isGroupMsg || msg.id.remote.isGroup(),
    };
    window._wpp.uploadMessage(data);
  });

  //  过程中新增的粉丝上报
  whatsapp.ChatStore.on('add', (chat: whatsapp.ChatModel) => {
    window._wpp.chatAdd(chatToFans(chat));
    // window._wpp.sendChatList();
  });
  whatsapp.ContactStore.on('add', (contactModel: whatsapp.ContactModel) => {
    window._wpp.chatAdd(chatToFans(contactModel));
  });

  whatsapp.ChatStore.on('change:unreadCount', (chat: whatsapp.ChatModel) => {
    if (chat)
      window._wpp.updateUnreadCount(
        chat.id._serialized,
        chat.unreadCount >= 0 && !chat.archive ? chat.unreadCount : 0
      );
  });

  whatsapp.ChatStore.on('change:archive', (chat: whatsapp.ChatModel) => {
    if (chat)
      window._wpp.updateUnreadCount(
        chat.id._serialized,
        chat.unreadCount >= 0 && !chat.archive ? chat.unreadCount : 0
      );
  });

  whatsapp.NewsletterStore.on('change:active', (chat: whatsapp.ChatModel) => {
    window._wpp.chatActive({
      active: chat.active,
      kind: chat.kind,
      id: {
        _serialized: chat.id._serialized,
      },
    });
  });

  whatsapp.ContactStore.on('change:name', (contact) => {
    if (contact.ck_nickname && contact.name !== contact.ck_nickname) {
      console.log('ContactStore change name', contact);
      contact.old_name = contact.name;
      contact.name = contact.ck_nickname;
    }
  });

  on('chat.active_chat', (chat: whatsapp.ChatModel) => {
    // console.log('chat.active_chat', chat)
    window._wpp.chatActive({
      active: chat.active,
      kind: chat.kind,
      id: {
        _serialized: chat.id._serialized,
      },
    });
  });

  // ------监测敏感行为
  whatsapp.ChatStore.on('remove', async (chatModel: whatsapp.ChatModel) => {
    const avatarData = whatsapp.ProfilePicThumbStore.get(
      chatModel.id._serialized
    );
    let avatar = '';
    if (avatarData?.img) {
      avatar = await window._wpp.getImageBase64ForUrl({
        url: avatarData.img,
      });
    }
    const params = {
      from: {
        account: window._userinfo.userId,
        img: window._userinfo.server_avatar,
        nickname: window._userinfo.nickname,
      },
      to: {
        account: chatModel.id._serialized,
        img: avatar,
        nickname:
          chatModel.formattedTitle ||
          chatModel.contact.pushname ||
          chatModel.contact.name ||
          chatModel.name,
      },
      fromIsMe: true,
    };
    console.log('chat remove', params);

    window._wpp.uploadSensitiveBehaviorChatDelete(params);
  });
  whatsapp.MsgStore.on(
    'change:body',
    async (msg: whatsapp.MsgModel, newBody: string, oldBody: string) => {
      if (newBody.startsWith('/9j/') || oldBody.startsWith('/9j/')) return;

      if (!msg.from || !msg.to) return;
      const formData = whatsapp.ContactStore.get(msg.from._serialized);
      const toData = whatsapp.ContactStore.get(msg.to._serialized);
      if (!formData || !toData) return;
      const fromAvatarData = formData.getProfilePicThumb();
      const toAvatarData = toData.getProfilePicThumb();

      let fromAvatar = '';
      if (fromAvatarData?.img) {
        fromAvatar = await window._wpp.getImageBase64ForUrl({
          url: fromAvatarData.img,
        });
      }
      let toAvatar = '';
      if (toAvatarData?.img) {
        toAvatar = await window._wpp.getImageBase64ForUrl({
          url: toAvatarData.img,
        });
      }

      const from = {
        account: formData.id._serialized,
        img: fromAvatar,
        nickname: formData.name || formData.pushname || formData.notifyName,
      };
      const to = {
        account: msg.to._serialized,
        img: toAvatar,
        nickname: toData.name || toData.pushname || toData.notifyName,
      };

      const params: any = {
        from,
        to,
        fromIsMe: msg.id.fromMe,
        msgId: msg.id._serialized,
      };

      if (newBody) {
        // 如果body 不为空 则是修改
        params.content = oldBody;
        params.editedContent = newBody;
        window._wpp.uploadSensitiveBehaviorMsgEdit(params);
      } else {
        // 如果body 为空则是删除
        params.content = oldBody;
        window._wpp.uploadSensitiveBehaviorMsgDelete(params);
      }
    }
  );
  // ------监测敏感行为
};

window._call = {
  openChat(chatId: string | undefined, phone: string | undefined) {
    if (chatId) chat.openChatFromUnread(chatId);
    else if (phone) chat.openChatFromUnread(phone);
  },
  getActiveCaptions() {
    return (
      chat
        .getActiveChat()
        ?.attachMediaContents?._models?.map?.((item: any) => item.caption) || []
    );
  },
  async specialSend() {
    const activeChat = chat.getActiveChat();
    if (!activeChat) return;

    const dialog = document.querySelector('._ajwz');
    if (dialog) window._wpp.domSetLoading(dialog, true);

    const models = activeChat.attachMediaContents?._models;
    for (const model of models) {
      if (model.caption && !window._wpp.isValidMessage(model.caption)) {
        model.caption = await window._wpp.toSendTranslation(
          model.caption,
          true,
          true
        );
      }
      await chat.sendFileMessage(
        activeChat.id,
        model.type === 'document' ? model.file._blob : model.editedFile,
        {
          type: model.type,
          // ...model.mediaPrep._mediaData,
          caption: model.caption,
        }
      );
    }

    activeChat.setAttachMediaContents(null);
    window._DrawerManager.closeDrawerMid();
    if (dialog) window._wpp.domSetLoading(dialog, false);
  },

  async getChatList() {
    const chatList: any[] = whatsapp.ChatStore.getModelsArray().map(
      (chat: whatsapp.ChatModel) => {
        const avatarData =
          chat.contact.profilePicThumb ||
          whatsapp.ProfilePicThumbStore.get(chat.id._serialized);

        return {
          // 聊天id
          chat_id: chat.id._serialized,
          // 聊天名称
          chat_name: chat.title(),
          // 类型
          chat_type: getChatType(chat.kind),
          // 是否是群聊
          is_group: chat.isGroup,
          ori_img_url: avatarData?.img,
          ori_img_key: avatarData?.filehash,
          chat_avatar: '',
          // 远程头像地址
          chat_server_avatar: '',
          unread_count: chat.unreadCount,
          // 显示的@ 谁
          username: chat.id.user,
        };
      }
    );
    return chatList;
  },
  async getFansInfo(id: string) {
    const chat = whatsapp.ChatStore.get(id);
    if (chat) {
      return chatToFans(chat);
    }

    const contact = whatsapp.ContactStore.get(id);
    if (contact) {
      return chatToFans(contact);
    }

    return;
  },

  async getFansList() {
    const fansList: any[] = [];
    const haveId: string[] = []; // 防止重复的
    // 回话列表
    // const chatList: ChatModel[] = await wpp.chat.list()
    try {
      const chatList: whatsapp.ChatModel[] =
        whatsapp.ChatStore.getModelsArray();
      for (const chatModel of chatList) {
        if (haveId.includes(chatModel.id._serialized)) continue;
        if (whatsapp.functions.getIsMe(chatModel.contact)) continue;
        haveId.push(chatModel.id._serialized);
        fansList.push(chatToFans(chatModel));
      }
    } catch (e) {
      console.error('getFansList Chat Model Error');
    }

    // 联系人列表
    try {
      // const contactList: whatsapp.ContactModel[] =
      // whatsapp.ContactStore.getFilteredContacts({});

      const contactList: whatsapp.ContactModel[] = await contact.list({
        onlyMyContacts: true,
      });

      for (const contactModel of contactList) {
        if (contactModel.id.server === 'lid') continue;
        if (haveId.includes(contactModel.id._serialized)) continue;
        if (whatsapp.functions.getIsMe(contactModel)) continue;
        haveId.push(contactModel.id._serialized);

        fansList.push(chatToFans(contactModel));
      }
    } catch (e) {
      console.error('getFansList Contact Model Error', e);
    }

    console.log(fansList);
    return fansList;
  },
  async getUserinfo(): Promise<any> {
    if (!window._userinfo) {
      const profileName = profile.getMyProfileName();
      const myStatus = await status.getMyStatus();

      const thumb = (await status.getMyStatus()).contact.profilePicThumb;
      // console.log('thumb', thumb.img, thumb.filehash, JSON.stringify(thumb))
      const avatar = await window._wpp.getImageBase64ForUrl({ url: thumb.img });

      console.log('avatar', avatar);
      window._userinfo = {
        userId: myStatus.id.user,
        username: myStatus.id._serialized,
        avatar: thumb.img,
        server_avatar: avatar,
        nickname:
          profileName ||
          myStatus.contact.formattedTitle ||
          myStatus.contact.pushname ||
          myStatus.contact.name,
        phone: myStatus.id.user,
        // _serialized: myStatus.id._serialized,
        version_no: whatsapp.contants.SANITIZED_VERSION_STR || '',
      };
    }

    return window._userinfo;
  },
  changeChatNickname(id: string, nickname?: string) {
    const rs = whatsapp.ContactStore.get(id);
    if (!rs) return '';
    console.log('ws changeChatNickname', id, rs.name, nickname);
    // @ts-ignore
    rs.ck_nickname = nickname;
    if (nickname) {
      // @ts-ignore
      if (!Object.prototype.hasOwnProperty.call(rs, 'old_name'))
        // @ts-ignore
        rs.old_name = rs.name;
      rs.name = nickname;
    } else {
      // @ts-ignore
      rs.name = rs.old_name;
    }

    return rs.name;
  },

  async getActiveChatId(): Promise<string | undefined> {
    return chat.getActiveChat()?.id._serialized;
  },

  setInputContents(val: string) {
    val = unescape(val);
    console.log('valll', val);
    const inputDom = document.querySelector(
      '#main > footer .lexical-rich-text-input [contenteditable="true"]'
    );
    if (!inputDom) return;
    //@ts-ignore
    const __lexicalEditor: any = inputDom.__lexicalEditor;
    const lexical = window.require('Lexical');
    __lexicalEditor.update(
      () => {
        const root = lexical.$getRoot();
        root.clear();
        if (val) {
          const paragraphNode = lexical.$createParagraphNode();
          const textNode = lexical.$createTextNode(val);
          paragraphNode.append(textNode);
          root.append(paragraphNode);
        }
      }
      // {
      //   onUpdate: () => callback(),
      // }
    );
  },

  async getMsgContents(id: string) {
    const msgModel: whatsapp.MsgModel | undefined = whatsapp.MsgStore.get(id);
    if (!msgModel) return '';
    if (['image', 'video', 'document'].includes(msgModel.type!))
      return msgModel.caption;
    return msgModel.body;
  },

  async getVoiceContents(id: string): Promise<any> {
    const msgModel: whatsapp.MsgModel | undefined = whatsapp.MsgStore.get(id);
    if (!msgModel) return null;
    if (!['ptt', 'audio'].includes(msgModel.type!)) return null;
    const data = await chat.downloadMedia(id).then(util.blobToBase64);
    return {
      data: data.replace('data:audio/ogg; codecs=opus;base64,', ''),
      format: 'ogg-opus',
      duration: Number(msgModel.duration || 0),
    };
  },

  async getMsgModel(msgId: string): Promise<any> {
    const msgModel = whatsapp.MsgStore.get(msgId);
    if (!msgModel) return undefined;

    return {
      type: msgModel.type,
      isGroupMsg: msgModel.isGroupMsg,
      fromMe: msgModel.id.fromMe,
      isGroup: msgModel.id.remote.isGroup(),
      server: msgModel.from?.server,
    };
  },
  scrollChatToBottom() {
    // whatsapp.Cmd._scrollChatToBottom();
    // @ts-ignore
    whatsapp.Cmd?.scrollChatHeight?.(10000);
  },
  async getInitUnreadCounts(): Promise<Record<string, number>> {
    return (
      whatsapp.ChatStore.getModelsArray()
        // .filter((item: any) => !item.archive)
        .reduce((acc: { [key: string]: number }, obj: whatsapp.ChatModel) => {
          acc[obj.id._serialized] =
            obj.unreadCount >= 0 && !obj.archive ? obj.unreadCount : 0;
          return acc;
        }, {})
    );
  },
  async toSend(
    body: string,
    type?: string,
    isHold: boolean = false
  ): Promise<string | void> {
    const chatData = chat.getActiveChat();
    if (!chatData) return;
    console.log('dddddd', body);
    return await window._call.toSendForId(chatData.id + '', body, type, isHold);
  },

  async toSendForId(
    id: string,
    body: string,
    type: string = 'text',
    isHold: boolean = false
  ): Promise<string | void> {
    const chatData = chat.get(id);
    if (!chatData) return;
    const sendOptions: any = {
      linkPreview: false,
    };
    if (isHold) {
      // 处理原生事件
      const quotedMsgId = chatData.composeQuotedMsg?.id?._serialized;
      if (quotedMsgId) {
        sendOptions['quotedMsg'] = quotedMsgId;
        chatData.composeQuotedMsg = null;
      }
      window._call.setInputContents('');
    }

    console.log('toSendForId', id, body, type, isHold);
    body = unescape(body);
    console.log('toSendForId2', id, body, type, isHold);

    switch (type) {
      case 'text': {
        const rs = await chat.sendTextMessage(chatData.id, body, sendOptions);
        if (rs.id) return rs.id;
        break;
      }
      case 'pic': {
        // @ts-ignore
        const fileInfo = await window.CPC.readFile(body);

        // const imgType = getFileType(arrayBuffer)
        if (fileInfo.mime === 'unknown' || !fileInfo.mime) return;
        const rs = await chat.sendFileMessage(
          chatData.id,
          new Blob([fileInfo.buffer], { type: fileInfo.mime }),
          Object.assign(
            {
              type: 'image',
              // isViewOnce: true
            },
            sendOptions
          )
        );

        if (rs.id) return rs.id;
        break;
      }
      case 'card': {
        try {
          const cardInfo = JSON.parse(body);
          const rs = await chat.sendVCardContactMessage(chatData.id, {
            id: cardInfo.account.replace(/[\s+]+/g, ''),
            name: cardInfo.nickname,
          });
          if (rs.id) return rs.id;
        } catch (e) {
          window._wpp.openToast('名片发送失败,名片信息不存在');
          console.error(e);
        }
        break;
      }
      case 'video': {
        // @ts-ignore
        const fileInfo = await window.CPC.readFile(body);

        // const imgType = getFileType(arrayBuffer)
        if (fileInfo.mime === 'unknown' || !fileInfo.mime) return;
        console.log('fileInfo', fileInfo);
        const rs = await chat.sendFileMessage(
          chatData.id,
          new Blob([fileInfo.buffer], { type: fileInfo.mime }),
          Object.assign(
            {
              type: 'video',
              // isViewOnce: true
            },
            sendOptions
          )
        );

        if (rs.id) return rs.id;
        break;
      }
      // 视频 sendFileMessage  type:video
      // 名片 sendVCardContactMessage
    }
    return;
  },
  /**
   * 获取导出私聊会话数据列表
   */
  async getExportPrivateChat(): Promise<any[]> {
    // await __wpp.chat.list({onlyUsers:true})
    // const list = await wpp.chat.list({ onlyUsers: true })
    return (await chat.list({ onlyUsers: true })).map(
      (chat: whatsapp.ChatModel) => {
        // console.log(chat.contact?.name, chat.contact?.pushname, chat.name, chat?.title())
        return {
          id: chat.id._serialized,
          username: chat.id.user,
          // nickname: chat.name,
          phone: chat.id.user,
          nickname: `${
            chat.contact?.name ||
            chat.contact?.pushname ||
            chat.name ||
            chat.title()
          }(${chat.title()})`,
          last_message_time: chat.t,
          unread_count:
            chat.unreadCount >= 0 && !chat.archive ? chat.unreadCount : 0,
          is_contacts: chat.contact?.isAddressBookContact === 1,
          is_vip: false, // 是否是平台会员: TG会员 没有写死false
        };
      }
    );
  },

  /**
   * 获取导出群组会话数据列表
   */
  async getExportGroup(): Promise<any[]> {
    // await __wpp.chat.list({onlyUsers:true})
    const myStatus = await status.getMyStatus();
    return (await chat.list({ onlyGroups: true })).map(
      (chat: whatsapp.ChatModel) => {
        // console.log(chat,chat.groupMetadata,chat.groupMetadata?.owner)
        const ownerId = chat.groupMetadata?.owner?._serialized || '';
        const ownerContact = ownerId
          ? whatsapp.ContactStore.get(ownerId)
          : null;
        return {
          id: chat.id._serialized,
          name: `${
            chat.groupMetadata?.subject ||
            chat.contact?.pushname ||
            chat.contact?.name ||
            chat.name ||
            chat.title()
          }(${chat.title()})`,
          member_count: chat.groupMetadata?.size, // 成员数
          unread_count:
            chat.unreadCount >= 0 && !chat.archive ? chat.unreadCount : 0, // 未读数
          owner_name: `${ownerContact?.pushname || ownerContact?.name || ownerId}`, // 群主名
          is_owner: myStatus.id._serialized === ownerId,
          last_message_time: chat.t,
        };
      }
    );
  },

  /**
   * 获取导出群组成员数据列表
   */
  async getExportGroupUser(): Promise<any[]> {
    // 群组成员
    // __wpp.whatsapp.ChatStore.get("120363183297008403@g.us").groupMetadata.participants
    const chatData = await chat.getActiveChat();
    if (!chatData) return [];
    return (
      chatData.groupMetadata?.participants.map((pm: any) => {
        return {
          id: pm.id._serialized,
          username: pm.id.user,
          phone: pm.id.user,
          first_name: `${pm.contact?.pushname || pm.contact?.name}`,
          is_contacts: pm.contact?.isAddressBookContact === 1,
          is_vip: false, // 是否是平台会员: TG会员 没有写死false
          join_time: 0, // 加群时间
          is_admin: pm.isAdmin, // 是否管理员
          is_owner: pm.isSuperAdmin, // 是否群主
        };
      }) || []
    );
  },
  async editMsgSend() {
    const inputDom = document.querySelector(
      '[class="x1n2onr6 x1c4vz4f x2lah0s"] [data-lexical-editor]'
    ) as any;
    const msgModel = getReactFiber(
      document.querySelector('[class="x1n2onr6 x1c4vz4f x2lah0s"]')
    )?.return?.memoizedProps?.msg;
    if (!inputDom) return;

    window._wpp.domSetLoading(inputDom, true);

    const tranText = await window._wpp.toSendTranslation(
      inputDom.__lexicalTextContent!,
      true,
      true
    );

    const msgId = msgModel.id._serialized;
    // console.log('aaa', msgId, tranText);
    chat.editMessage(msgId, tranText);

    window._wpp.domSetLoading(inputDom, false);
    window._ModalManager.close();
    console.log('editMsgSend', inputDom, msgModel);
  },
};

webpack.onReady(() => {
  console.log('onReady');
  window._DrawerManager =
    webpack.webpackRequire('WAWebDrawerManager')?.DrawerManager;
  window._ModalManager =
    webpack.webpackRequire('WAWebModalManager')?.ModalManager;
  window._wpp.init();
});

on('conn.logout', () => {
  window._wpp.logout();
});
