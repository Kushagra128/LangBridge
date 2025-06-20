export default async function handler(req, res) {
	if (req.method !== "POST") {
		res.status(405).json({ error: "Method not allowed" });
		return;
	}
	res
		.status(501)
		.json({
			error:
				"Text-to-speech is not supported on Vercel. This endpoint requires Python, which is not available in Vercel serverless functions.",
		});
}
