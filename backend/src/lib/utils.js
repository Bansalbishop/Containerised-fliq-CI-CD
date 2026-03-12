import jwt from "jsonwebtoken";
import env from "dotenv";

env.config();

export const generatetoken = (userId, res) => {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: "3d",
  });

  res.cookie("jwt", token, {
    maxAge: 3 * 24 * 60 * 60 * 1000,
    httpOnly: true,
    sameSite: "none", // allow cross-site cookies (Vercel → Render)
    secure: true, // required when sameSite is "none"
  });

  return token;
};
