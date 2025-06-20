import { signup } from "../../backend/src/controllers/auth.controller.js";

export default async function handler(req, res) {
	if (req.method !== "POST") {
		res.status(405).json({ error: "Method not allowed" });
		return;
	}
	await signup(req, res);
}
