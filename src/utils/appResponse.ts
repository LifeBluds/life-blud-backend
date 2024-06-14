import { Response } from "express";

export const AppResponse = (
  res: Response,
  statusCode: number = 200,
  data: any = null,
  message: string = "",
  success: boolean = true,
) => {
  return res.status(statusCode).json({
    data,
    message,
    success,
  });
};
