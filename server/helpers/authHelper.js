import bcrypt from "bcrypt";

export const hashPassword = async (password) => {
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    return hashedPassword;
  } catch (error) {
    console.log(error.message);
  }
};

export const comparePassword = async (incomingpassword, hashedPassword) => {
  return bcrypt.compare(incomingpassword, hashedPassword);
};
