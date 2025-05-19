import Chatty from "../models/chatty.model.js";
import User from "../models/user.model.js";

/**
 * Upsert (create or update) a user in Chatty collection based on Firebase Auth data
 * Expects: { firebaseUid, provider, displayName, email, photoURL }
 */
export const upsertFirebaseUser = async (req, res) => {
  try {
    const { firebaseUid, provider, displayName, email, photoURL } = req.body;
    if (!firebaseUid || !provider || !email) {
      return res.status(400).json({ message: "Missing required Firebase user fields." });
    }

    // Optional: Link to User collection if email matches
    let user = await User.findOne({ email });
    if (!user) {
      // Create a new User if not exists (optional, can skip if not desired)
      user = new User({
        username: displayName ? displayName.replace(/\s+/g, "_").toLowerCase() : email.split("@")[0],
        email,
        password: firebaseUid, // Not used, but required by schema
        profileImage: photoURL || "",
      });
      await user.save();
    }

    // Upsert in Chatty collection
    const chattyUser = await Chatty.findOneAndUpdate(
      { firebaseUid },
      {
        userId: user._id,
        firebaseUid,
        provider,
        displayName,
        email,
        photoURL,
        lastLogin: new Date(),
      },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    );

    res.status(200).json({ message: "User upserted successfully", chattyUser });
  } catch (error) {
    console.error("Error in upsertFirebaseUser:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
