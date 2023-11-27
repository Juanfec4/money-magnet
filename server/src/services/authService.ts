import bcrypt from "bcryptjs";

export const isMatchingHash = (input: string, hash: string): boolean => {
  return bcrypt.compareSync(input, hash);
};

export const hashPassword = (input: string): string => {
  return bcrypt.hashSync(input, 10);
};
