import { createCookie } from "remix";

export const picoEngine = createCookie("pico", {
  maxAge: 604_800, // one week
  sameSite: "strict",
  httpOnly: true
});