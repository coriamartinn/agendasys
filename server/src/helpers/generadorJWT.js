import jwt from "jsonwebtoken";

export const genJWT = async (payload) => {
  const token = process.env.JWT_SECRET;
  return await jwt.sign(payload, token, { expiresIn: "2h" });
};
