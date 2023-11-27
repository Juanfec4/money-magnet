import * as nanoid from "nanoid";

const alphabet = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";

export const generateUUID = async (): Promise<string> => {
  const generator = await nanoid.customAlphabet(alphabet, 10);
  return generator();
};
