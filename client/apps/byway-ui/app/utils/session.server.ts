import bcrypt from "bcryptjs";
import { createCookieSessionStorage, redirect} from "remix";

type LoginForm = {
  username: string;
  password: string;
}

export const register = async ({
  username,
  password}: LoginForm) => {
  const passwordHash = await bcrypt.hash(password, 10);
  const user = await

                               })