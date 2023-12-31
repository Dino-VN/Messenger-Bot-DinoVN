import { aliases, commands, cooldowns, events } from "..";
import { ReadStream } from "fs";

//facebook-comment-api
interface FbApi {
	getAppstate(callback?: ((err: any, data: any) => void)): any;
	dtsg: string;
	uid: string;
	accessToken: string;
	info: object;
	getInfo(userID: string, callback?: ((err: any, data: any) => void)): any;
	getInfoComment(commentID: string, callback?: ((err: any, data: any) => void)): any;
	listen(callback: ((err: any, data: any) => void)): any;
	sendComment(comment: string, target: string, callback?: ((err: any, data: any) => void)): any;
}

interface ThreadInfo {
	threadID: string,
	participantIDs: string[],
	threadName: string,
	userInfo: UserInfo[],
	nicknames: { [id: string]: string },
	unreadCount: number,
	messageCount: number,
	imageSrc: string | null,
	timestamp: number,
	muteUntil: number,
	isGroup: boolean,
	isSubscribed: boolean,
	folder: 'inbox' | 'archive',
	isArchived: boolean,
	cannotReplyReason: string | null,
	lastReadTimestamp: number,
	emoji: string | null,
	color: string,
	adminIDs: string[],
	approvalMode: boolean,
	approvalQueue: object[],
}

interface UserInfo {
	name: string,
	firstName: string,
	thumbSrc: string,
	profileUrl: string,
	gender: string,
	type: any,
	isFriend: boolean,
	isBirthday: boolean,
	searchTokens: any,
	alternateName: string,
}

export interface api {
	//Custom
	commands: typeof commands
	aliases: typeof aliases
	cooldowns: typeof cooldowns
	events: typeof events
	serverInstance: any,
	uptime: number,

	// fb: FbApi,
	//------
	/**
	 * Dùng để đổi tên người dùng trong nhóm hoặc chat riêng
	 * @param nickname Tên để đổi thôi
	 * @param threadID Id của nhóm chat hoặc id người dùng để bot chat"
	 * @param participantID Id người muốn đổi tên
	 * @param callback 
	 * @example
	 * ```js
	 * api.changeNickname("Example", "000000000000000", "000000000000000", (err) => {
   *    if(err) return console.error(err);
   * });
	 * ```
	 */
	changeNickname(nickname: string, threadID: string, participantID: string, callback?: ((err: any) => void)): any;
	/**
	 * Lấy Id của tài khoản hiện tại đang login thôi
	 */
	getCurrentUserID(): string;
	listenMqtt(callback: ((err: any, event: any) => void)): any;
	/**
	 * Tìm thông tin người dùng từ tên
	 * @param name Tên người muốn tìm
	 * @param callback 
	 * @example
	 * ```js
	 * api.getUserID("Marc Zuckerbot", (err, data) => {
   *    if(err) return console.error(err);
	 *
   *    // Send the message to the best match (best by Facebook's criteria)
   *    var msg = "Hello!"
   *    var threadID = data[0].userID;
   *    api.sendMessage(msg, threadID);
   * });
	 * ```
	 */
	getUserId(name: string, callback: (err: any, obj: any[]) => void): any;
	/**
	 * Lấy thông tin người dùng từ id người dùng
	 * @param ids Array id người dùng muốn lấy
	 * @param callback 
	 * @example
	 * ```js
	 *  api.getUserInfo([1, 2, 3, 4], (err, ret) => {
 	 *    if(err) return console.error(err);
	 *
   *    for(var prop in ret) {
   *        if(ret.hasOwnProperty(prop) && ret[prop].isBirthday) {
   *            api.sendMessage("Happy birthday :)", prop);
   *        }
   *    }
   * });
	 * ```
	 */
	getUserInfo(ids: string[], callback?: ((err: any, obj: UserInfo[]) => void)): UserInfo[];
	addUserToGroup(userID: string, threadID: string, callback?: ((err: any) => void)): any;
	changeAdminStatus(threadID: string, adminIDs: string | string[], adminStatus: boolean, callback: ((err: any) => void)): any
	getThreadInfo(threadID: string, callback?: ((err: any, info: ThreadInfo) => void)): ThreadInfo;
	getThreadList(limit: number, timestamp?: number | null, tags?: string[], callback?: ((err: any, list: {
		threadID: string,
		name: string,
		unreadCount: string,
		isGroup: boolean,
	}[]) => any)): any;
	/**
	 * Dùng để gửi tin nhắn đến nhóm hoặc người dùng
	 * @param message Tin nhắn gửi hoặc Object chứa body và attachment
	 * @param threadID Nhóm hoặc người dùng để gửi tin nhắn đến
	 * @param callback Có thể bỏ qua dùng thẳng messageID
	 * @param messageID Id của tin nhắn muốn bot reply lại
	 * @example Gửi tin nhắn
	 * ```js
	 * var yourID = "000000000000000";
   * var msg = "Hey!";
   * api.sendMessage(msg, yourID);
	 * ```
	 * @example Gửi tin nhắn với tệp đính kèm
	 * ```js
	 * var yourID = "000000000000000";
   * var msg = {
   *    body: "Hey!",
   *    attachment: fs.createReadStream(__dirname + '/image.jpg')
   * }
	 * ```
    api.sendMessage(msg, yourID);
	 */
	sendMessage(message: string | {
		body?: string,
		attachment?: ReadStream,
	}, threadID: string, callback?: ((err: any, messageInfo: event) => void) | string, messageID?: string): any;
	sendTypingIndicator(threadID: string, callback?: ((err: any) => void)): any;
	setMessageReaction(reaction: string , messageID: string, callback?: (err: any) => void, customIcon?: boolean): any;
	unsendMessage(messageID: string, callback?: (err: any) => void): any;
	changeBio(bio: string, publish: boolean, callback?: ((err: any) => void)): any;
	httpPost(url: string, form: object, callback?: ((err: any, res: any) => void), notAPI?: boolean): any;
	// [methodName: string]: (...args: any[]) =>any;
}

interface Attachment {
	type: string;
	name: string;
	url: string;
}

export interface event {
	type: "message" | "event" | "typ" | "read" | "read_receipt" | "message_reaction" | "presence" | "message_unsend" | "message_reply",
	reaction: string;
	senderID: string,
	threadID: string,
	args: string[],
	body: string,
	messageID: string,
	attachments: [],
	mentions: object,
	timestamp: number,
	isGroup: boolean,
	participantIDs?: []
	messageReply?: {
		threadID: string,
		messageID: string,
		senderID: string,
		attachments: Attachment[],
		args: string[],
		body: string,
		isGroup: boolean,
		mentions: {},
		timestamp: number
	},
	logMessageType: string,
}