import { Request, Response, NextFunction } from "express";

export const asyncHandler =
  (fn: Function) =>
  (req: Request, res: Response, next: NextFunction) =>
    Promise.resolve(fn(req, res, next)).catch(next);
// Usage example:
// app.get('/some-route', asyncHandler(async (req, res, next) => {
//   const data = await someAsyncOperation();
//   res.json(data);
// }));
