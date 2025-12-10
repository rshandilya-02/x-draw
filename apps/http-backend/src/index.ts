import express from 'express';
// import 'dotenv/config';
import dotenv from 'dotenv';
dotenv.config();
import { JWT_SECRET } from '@repo/backend-common/client';
import authRoute from './routes/authRoute';

import { prisma } from '@repo/db';
import { auth } from './utils/middleware';
import cors from 'cors';
console.log('priting JWT_SECRET', JWT_SECRET);

const app = express(); 
app.use(express.json());

app.use(cors());

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
    const { roomName } = req.body;



    const userId = req.userId;
    if (!userId) return res.status(403).json({
        "message":"missing slug while creating room"
    })
    try {
        const room = await prisma.room.findFirst({
            where: {
                slug: roomName
            }
        });

        if (room) return res.status(403).json({
            message: "roomName take , please try other name"
        });
        const response = await prisma.room.create({
            data: {
                slug: roomName,
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

app.get('/fetchChats/:roomId', auth, async (req, res) => {
    const roomId = req.params.roomId;
    console.log('roomId ', roomId);
    if (!roomId) return res.json({
        message: "missing roomId"
    });
    try {
        const data = await prisma.chat.findMany({
            where: {
                roomId: Number(roomId)
            }
        });
        return res.status(200).json({
            message: "chat fetched successfully",
            data: data
        });
    } catch (error) {
        console.error(error);
        return res.status(502).json({
            message: "chat invaid"
        })
    }


});

app.get('/room/:slug', auth, async (req, res) => {
    console.log('inside room/slug');
    const slug = req.params.slug;
    console.log(slug);
    if (!slug) return res.status(403).json({
        message: "roomId missing"
    });
    try {
        console.log('ready to make db call');
        const roomId = await prisma.room.findFirst({
            where: {
                slug: slug
            }
        });
        console.log('roomId fetched ', roomId);
        if (!roomId) return res.status(403).json({
            message: "No such room exists",
            data: null
        });
        return res.status(200).json({
            message: "roomId fetched successfully",
            data: roomId.id
        });
    } catch (error) {
        return res.status(503).json({
            message: "error while fetching roomId"
        });
    }
})


app.listen(4000, () => console.log('sever started at port 4000'));