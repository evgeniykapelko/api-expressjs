import express from "express";

const userRouter = express.Router();

userRouter.post('/login', (req: any, res: any) => {
    res.send('login');
});

userRouter.post('/register', (req: any, res: any) => {
    res.send('register')
});

export { userRouter }