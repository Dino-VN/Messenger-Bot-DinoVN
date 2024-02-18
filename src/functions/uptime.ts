import { Function } from "../core/interfaces/index.ts";
import express from "express";

export const functionFile: Function = {
	execute(api) {
		if(!api.config.UPTIME) return
		const app = express();

		app.all("/", (req, res) => {
			res.send("Ok")
		})

		const PORT = api.config.PORT || process.env.SERVER_PORT || 3000

		app.listen(PORT, () => {
			console.info("Chạy web uptime thành công ở port: " + PORT);
		});
	},
};
