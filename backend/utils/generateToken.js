// utils/generateToken.js
import jwt from "jsonwebtoken";

/**
 * Generates a JWT token.
 * Accepts either:
 *  - a user object: { _id, role }
 *  - or a user id string
 * Optionally you may pass a role as second argument.
 */
const generateToken = (userOrId, maybeRole) => {
  let id;
  let role = maybeRole || "user";

  if (!userOrId) {
    throw new Error("Invalid argument to generateToken");
  }

  // If it's an object with _id use that
  if (typeof userOrId === "object" && userOrId._id) {
    id = userOrId._id;
    role = userOrId.role || role;
  } else {
    // assume it's an id string
    id = userOrId;
  }

  return jwt.sign({ id, role }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "1d",
  });
};

export default generateToken;
