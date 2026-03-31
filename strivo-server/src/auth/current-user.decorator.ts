import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export type CurrentUser = {
  userId: number;
};

export const CurrentUser = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext): CurrentUser => {
    const req = ctx.switchToHttp().getRequest();
    return req.user as CurrentUser;
  },
);

