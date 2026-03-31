import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export type CurrentUser = {
  userId: number;
};

type RequestWithUser = {
  user?: CurrentUser;
};

export const CurrentUser = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext): CurrentUser => {
    const req = ctx.switchToHttp().getRequest<RequestWithUser>();
    return req.user ?? { userId: 0 };
  },
);
