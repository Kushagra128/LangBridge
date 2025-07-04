import { updateProfile } from "../../backend/src/controllers/auth.controller.js";

export default async function handler(req, res) {
	if (req.method !== "PUT") {
		res.status(405).json({ error: "Method not allowed" });
		return;
	}
	await updateProfile(req, res);
}
