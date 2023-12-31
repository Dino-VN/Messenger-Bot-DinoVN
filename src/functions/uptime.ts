import { Function } from "../core/interfaces/index.ts";
import express from "express";

export const functionFile: Function = {
	execute(api) {
		if(!process.env.UPTIME) return
		const app = express();

		app.all("/", (req, res) => {
			res.send("Ok")
		})

		const PORT = process.env.SERVER_PORT || process.env.PORT || 3000

		app.listen(PORT, () => {
			console.info("Chạy web uptime thành công ở port: " + PORT);
		});
	},
};
