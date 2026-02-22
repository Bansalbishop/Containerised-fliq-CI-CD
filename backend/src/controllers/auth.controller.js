import { generatetoken } from "../lib/utils.js";
import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import cloudinary from "../lib/cloudinary.js";

export const signup = async (req, res) => {
  const { fullName, email, password } = req.body;

  try {
    // hash passwords if pass is 123456 it will be saved as sjnksjnk4jk5kj3nkj2nk4j5nkj3n2jk5b6hu6iu5
    if (!fullName || !email || !password) {
      res.status(400).json({ message: "Enter complete details" });
    }
    if (password.length < 6) {
      return res
        .status(400)
        .json({ message: "password must be atleast of length 6" });
    }
    const user = await User.findOne({ email });
    if (user) return res.status(400).json({ message: "Email already exists" });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const newUser = new User({
      fullName,
      email,
      password: hashedPassword,
    });
    if (newUser) {
      // generate jwt tokens
      generatetoken(newUser._id, res);
      await newUser.save();
      res.status(200).json({
        _id: newUser._id,
        fullName: newUser.fullName,
        email: newUser.email,
        profilePic: newUser.profilePic,
      });
    } else {
      (res.status(400), json({ message: "Invalid user data" }));
    }
  } catch (error) {
    console.log("error in singup controller", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    if (!email || !password) {
      return res
        .status(500)
        .json({ message: "Please fill complete credentials" });
    }

    const user = await User.findOne({ email });
    if (user) {
      const isPassword = await bcrypt.compare(password, user.password);
      if (!isPassword) {
        return res.status(400).json({ message: "Invalid credentials" });
      }
      generatetoken(user._id, res);
      return res.status(200).json({
        _id: user._id,
        fullName: user.fullName,
        email: user.email,
        profilePic: user.profilePic,
      });
    } else {
      return res.status(400).json({ message: "Invalid credentials" });
    }
  } catch (error) {
    console.log("error in login controller", error.message);
    res.status(500).json({ message: "internal server error" });
  }
};

export const logout = (req, res) => {
  try {
    res.cookie("jwt", "", { maxAge: 0 });
    res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    console.log("error in logout controller", error.message);
    res.status(500).json({ message: "internal server error" });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const { profilePic } = req.body;
    const userId = req.user._id;
    if (!profilePic) {
      return res.status(400).json({ message: "Image is required" });
    }
    const uploadResponse = await cloudinary.uploader.upload(profilePic);
    const updateUser = await User.findByIdAndUpdate(
      userId,
      { profilePic: uploadResponse.secure_url },
      { new: true },
    );
    res.status(200).json(updateUser);
  } catch (error) {
     console.log("error in updating profile", error.message);
    res.status(500).json({ message: "internal server error" });
  }
};


export const checkAuth=(req,res)=>{
  try {
    res.status(200).json(req.user);
  } catch (error) {
    console.log("error in checkAuth", error.message);
    res.status(500).json({ message: "internal server error" });
    
  }
}