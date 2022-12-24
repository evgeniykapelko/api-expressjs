import express, { Request, Response, NextFunction} from 'express';
import { userRouter } from './users/users.js';

const port = 8001;
const app = express();

//app.all('/')
app.get('/hello', (req, res) => {
    res.send('Hey from express!')
});

app.use('/users', userRouter);

app.listen(port, () => {
    console.log(`Server run on http://localhost:${port}`)

})

// const server = http.createServer((req, res) => {
//     res.statusCode = 200;
//     res.setHeader('Content-Type', 'text/plain');
//     res.end('Hey!');
// });

// server.listen(port, host, () => {
//     console.log(`Server run on ${host}:${port}`)
// });