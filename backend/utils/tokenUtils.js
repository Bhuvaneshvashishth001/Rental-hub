import jwt from 'jsonwebtoken';

/**
 * Generate JWT Token
 */
export const generateToken = (userId) => {
  console.log("🔑 [GENERATE TOKEN] SECRET:", process.env.JWT_SECRET);

  const token = jwt.sign(
    { id: userId },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_EXPIRE || '7d',
    }
  );

  console.log("🪪 [GENERATE TOKEN] TOKEN:", token);

  return token;
};

/**
 * Verify JWT Token
 */
export const verifyToken = (token) => {
  console.log("🔑 [VERIFY TOKEN] SECRET:", process.env.JWT_SECRET);
  console.log("📥 [VERIFY TOKEN] RECEIVED TOKEN:", token);

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    console.log("✅ [VERIFY TOKEN] DECODED:", decoded);

    return decoded;
  } catch (error) {
    console.log("❌ [VERIFY TOKEN] ERROR:", error.message);
    throw new Error('Invalid or expired token');
  }
};