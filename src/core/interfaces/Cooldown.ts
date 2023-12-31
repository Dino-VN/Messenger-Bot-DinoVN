import { Collection } from "@discordjs/collection";

export interface Cooldown {
    requestCount: Collection<string, number>,
    cooldowns: Collection<string, number>
}