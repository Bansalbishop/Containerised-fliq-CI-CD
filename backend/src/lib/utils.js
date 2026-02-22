import jwt from "jsonwebtoken";
import env from "dotenv";
env.config();
export const generatetoken = (userId, res) => {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: "3d",
  });
  res.cookie("jwt", token, {
    maxAge: 3 * 24 * 60 * 60 * 1000,
    httpOnly: true, //prevents xss attacks that is cross site scripting attacks
    sameSite: "strict", //CSRF attack cross site request forgery attacks
    secure: process.env.NODE_ENV !== "development",
  });
  return token;
};
