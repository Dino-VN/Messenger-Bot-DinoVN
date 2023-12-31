import { aliases, commands, cooldowns, events } from "..";
<<<<<<< HEAD
import { ReadStream } from "fs";
=======
>>>>>>> parent of 84a1155 (Merge remote-tracking branch 'origin/master' into Core)

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

	guilds: string[],

	// fb: FbApi,
	//------
	changeNickname(nickname: string, threadID: string, participantID: string, callback?: ((err: any) => void)): any;
	getCurrentUserID(): string
	listenMqtt(callback: ((err: any, event: any) => void)): any;
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