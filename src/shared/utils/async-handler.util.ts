import { NextFunction, Request, Response } from "express";

type AsyncRequestHandler = (
  req: Request,
  res: Response,
  next: NextFunction
) => Promise<any>;

export const asyncHandler = (fn: AsyncRequestHandler) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

// Alternative: Auto-binding decorator (if using decorators)
export function bindMethods(target: any) {
  const prototype = Object.getPrototypeOf(target);
  const methodNames = Object.getOwnPropertyNames(prototype);

  methodNames.forEach((name) => {
    const method = target[name];
    if (typeof method === "function" && name !== "constructor") {
      target[name] = method.bind(target);
    }
  });
}
