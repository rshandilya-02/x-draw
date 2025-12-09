import express from 'express';
// import 'dotenv/config';
import dotenv from 'dotenv';
dotenv.config();
import { JWT_SECRET } from '@repo/backend-common/client';
import authRoute from './routes/authRoute';

import { prisma } from '@repo/db';
import { auth } from './utils/middleware';

console.log('priting JWT_SECRET', JWT_SECRET);

const app = express(); 
app.use(express.json());

app.use('/auth', authRoute);
// const check = async () => {
//     const response = await prisma.user.findFirst();
//     console.log('response is ', response);

// };


// check();


app.post('/room', auth, async(req, res) => {
    // const {slug,adminId} = req.body;
    //dbcall
    // if (!slug || !adminId) return res.status(403).json({
    //     message: "missing details"
    // });
    const userId = req.userId;
    if (!userId) return res.status(403).json({
        "message":"missing slug while creating room"
    })
    try {

        const response = await prisma.room.create({
            data: {
                slug: userId,
                adminId: userId
            }
        });
        return res.json({
            status: "200",
            message: response
        })
    } catch (error) {
        console.error(error);
        return res.status(403).json({
            message: "error in room creation"
        })
    }
})


app.listen(4000, () => console.log('sever started at port 4000'));