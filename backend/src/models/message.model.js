import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
	{
		senderId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			required: true,
		},
		receiverId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			required: true,
		},
		text: {
			type: String,
		},
		image: {
			type: String,
		},
		voiceMessage: {
			type: String,
		},
		isVoice: {
			type: Boolean,
			default: false,
		},
		language: {
			type: String,
			default: "en",
			enum: ["en", "es", "fr", "de", "it", "pt", "ru", "zh", "ja", "ar", "hi"],
		},
	},
	{ timestamps: true }
);

// Make sure at least one of text, image, or voiceMessage is present
messageSchema.pre("save", function (next) {
	if (!this.text && !this.image && !this.voiceMessage) {
		return next(
			new Error("Message must have either text, image, or voice message")
		);
	}
	next();
});

const Message = mongoose.model("Message", messageSchema);

export default Message;
