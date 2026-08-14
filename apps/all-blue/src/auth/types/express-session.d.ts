import Session from 'express-session';

declare module 'express-session' {
    interface SessionData {
        views?: number; //  apps/all-blue/src/auth/auth.controller.ts 里的 req.session.views就不会报ts错了
        // 如果有其他 可以自行加
        user?: {
            username: string;
            role: string;
        },
    }
}

