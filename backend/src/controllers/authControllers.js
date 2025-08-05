
import User from '../models/User.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { upsertStreamUser } from '../lib/stream.js';

export const signup = async (req, res) => {
    const { fullName, email, password } = req.body;

    try {

        if (!fullName || !email || !password) {
            return res.status(400).json({ message: "All Fields are Required" });
        }
        if (password.length < 6) {
            return res.status(400).json({ message: "password must be atleast 6 Characters" });
        }

        //email valodator
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ message: "Invalid Email format" })
        };

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "Email Already Exists" })
        }

        const idx = Math.floor(Math.random() * 100) + 1; //generate number from 1 to 100
        const randomAvatar = `https://avatar.iran.liara.run/public/${idx}.png`;

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = await User.create({
            fullName,
            email,
            password: hashedPassword,
            profilePics: randomAvatar,
        });

        try {
            await upsertStreamUser({
                id: newUser._id.toString(),
                name: newUser.fullName,
                image: newUser.profilePics || "",
            });
            console.log(`Stream user created for user Id: ${newUser._id}`)
        } catch (error) {
            console.log("Error Creating Stream user : ", error)
        }

        const token = jwt.sign({ userId: newUser._id }, process.env.JWT_SECRET_KEY, {
            expiresIn: "7d"
        });

        res.cookie("jwt", token, {
            maxAge: 7 * 24 * 60 * 60 * 1000,
            https: true,
            sameSite: "strict",
            secure: process.env.NODE_ENV === "production"
        });
        res.status(200).json({ success: true, message: "User Created Successfully", user: newUser })
    } catch (error) {
        console.log("Error in Signup Controller", error);
        res.status(500).json({ message: "Internal Error" })
    }
}

export const login = async (req, res) => {
    const { email, password } = req.body;
    try {
        if (!email || !password) {
            return res.status(400).json({ message: "All Fields are Required" });
        }
        const existingUser = await User.findOne({ email });
        if (!existingUser) return res.status(400).json({ message: "Invalid email" })

        const isPasswordCorrect = await bcrypt.compare(password, existingUser.password);
        if (!isPasswordCorrect) return res.status(400).json({ message: "Invalid password" });

        const token = jwt.sign({ userId: existingUser._id }, process.env.JWT_SECRET_KEY, {
            expiresIn: "7d"
        });

        res.cookie("jwt", token, {
            maxAge: 7 * 24 * 60 * 60 * 1000,
            httpOnly: true, // Add this for security (important!)
            sameSite: "strict",
            secure: process.env.NODE_ENV === "production"
        });

       const { password: _, ...userData } = existingUser._doc;
        res.status(200).json({ success: true, message: "Login Successfully", user: userData });
    } catch (error) {
        console.log("Error in Login Controller", error.message);
       res.status(500).json({ message: "Internal Server Error" });
    }
}

export const logout = async (req, res) => {
    try {
        res.clearCookie("jwt", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
        });
        res.status(200).json({ success: true, message: "Logged Out Successfully" });
    } catch (err) {
        res.status(500).json({ success: false, message: "Error during logout" });
    }
};


export const onboarding = async (req, res) => {
    try {
        const userId = req.user?._id;
        if (!userId) {
            return res.status(401).json({ message: "Unauthorized: User not found in request." });
        }

        let { fullName, bio, nativeLanguage, learningLanguage, location } = req.body;

        // Optional: Trim all string inputs
        fullName = fullName?.trim();
        bio = bio?.trim();
        nativeLanguage = nativeLanguage?.trim();
        learningLanguage = learningLanguage?.trim();
        location = location?.trim();

        const missingFields = [
            !fullName && "Full Name",
            !bio && "Bio",
            !nativeLanguage && "Native Language",
            !learningLanguage && "learning Language",
            !location && "Location"
        ].filter(Boolean);

        if (missingFields.length) {
            return res.status(400).json({
                message: "All Fields are Required",
                missingFields,
            });
        }

        const updatedUser = await User.findByIdAndUpdate(
            userId,
            {
                fullName,
                bio,
                nativeLanguage,
                learningLanguage,
                location,
                isOnboarded: true,
            },
            { new: true }
        );

        if (!updatedUser) {
            return res.status(404).json({ message: "User not found" });
        }

        // Sync with Stream (optional third-party)
        try {
            await upsertStreamUser({
                id: updatedUser._id.toString(),
                name: updatedUser.fullName,
                image: updatedUser.profilePics || "",
            });
            console.log(`✅ Stream user profile updated for ${updatedUser.fullName}`);
        } catch (streamError) {
            console.log("⚠️ Error updating Stream user:", streamError.message);
        }

        res.status(200).json({ success: true, user: updatedUser });
    } catch (error) {
        console.error("❌ Error in Onboarding:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};
