import { Response } from "express";

export const setCookie = (res: Response, name: string, value: string) => {
  res.cookie(name, value, {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    maxAge: 24 * 7 * 60 * 60 * 1000,
  });
};
