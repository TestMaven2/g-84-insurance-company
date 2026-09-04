import { User } from '../../users/user.entity';
// Очень важно прописать этот импорт вручную!
// Без этого будет использоваться Request глобальный (из DOM),
// а это не тот тип, который нам нужен.
// Нам нужен тип Request из фреймворка Express.
import type { Request } from 'express';

export interface AuthenticatedRequest extends Request {
  user: User;
}
