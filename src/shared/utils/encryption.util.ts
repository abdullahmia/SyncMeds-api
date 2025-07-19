import bcrypt from "bcryptjs";

const SALT_ROUNDS = 12;

/**
 * Hashes a plain text password
 * @param plainPassword The plain text password to hash
 * @returns Promise<string> - The hashed password
 * @throws Error if hashing fails
 */
export const hashPassword = async (plainPassword: string): Promise<string> => {
  try {
    const salt = await bcrypt.genSalt(SALT_ROUNDS);
    return await bcrypt.hash(plainPassword, salt);
  } catch (error) {
    throw new Error("Password hashing failed");
  }
};

/**
 * Compares a plain text password with a hashed password
 * @param plainPassword The plain text password to compare
 * @param hashedPassword The hashed password to compare against
 * @returns Promise<boolean> - True if passwords match, false otherwise
 * @throws Error if comparison fails
 */
export const comparePasswords = async (
  plainPassword: string,
  hashedPassword: string
): Promise<boolean> => {
  try {
    return await bcrypt.compare(plainPassword, hashedPassword);
  } catch (error) {
    throw new Error("Password comparison failed");
  }
};
