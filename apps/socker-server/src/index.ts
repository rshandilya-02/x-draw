import express from 'express';
import { Server, Socket } from 'socket.io';
import { createServer } from 'node:http';
import { JWT_SECRET } from '@repo/backend-common/client';
import jwt, { JwtPayload } from 'jsonwebtoken';
// import { prisma } from '@repo/db';

import { Queue } from 'bullmq';

const chatQueue = new Queue('chat-queue');

interface User {
    socket: Socket,
    rooms: String[],
    userId: string
};

const users: User[] = [];

function vaidateUser(token: string):string | null {
    try {
        console.log('token ', token);
        const decoded = jwt.verify(token, JWT_SECRET);
        console.log('decoded ', decoded);
        if(!decoded)
            return null; 
        return (decoded as JwtPayload).id;
    } catch (error) {
        console.error(error);
        return null;
    }
}

const app = express();
const server = createServer(app);



const io = new Server(server, {
    cors: {
        origin: "http://localhost:3000", // your frontend
        methods: ["GET", "POST"],
        credentials: true
    }
});

io.on('connection', (socket) => {
    console.log('a user is connected');
    
    // console.log('socket check', socket.handshake);
    console.log(socket.handshake.query.token);
    if (!socket.handshake.query.token) {
        socket.disconnect();
    }
    const token:string = socket.handshake.query.token as string;
    const userId = vaidateUser(token);
    console.log('user Id', userId);
    if (!userId) {
        socket.disconnect();
        return;
    };
    console.log('ready');
    socket.on('message', async (rawMsg) => {
        let msg = rawMsg;
        if (typeof rawMsg === 'string') {
            try {
                msg = JSON.parse(rawMsg);
            } catch (e) {
                console.error('Failed to parse message JSON:', e);
                return;
            }
        }
        console.log("message is ", msg);
        // msg = JSON.parse(msg);
        if (!msg) return; 
        console.log('ready to join join-room',msg.type);
        if (msg.type === 'join-room') {
            console.log('inside join-room');
            const user = users.find((user) => user.userId === userId);
            socket.join(msg.roomId);
            console.log('check user ', user?.userId);
            if (!msg.roomId) return;
            if (user) {
                console.log('user do exist ', user.userId,' ',user.rooms);
                if (user.rooms.includes(msg.roomId)) {
                    return;
                } else {
                    user.rooms.push(msg.roomId);
                }
            }
            else {
                users.push({
                    socket: socket,
                    rooms: [msg.roomId],
                    userId: userId
                });
                console.log('else block', users);
            }
        };

        if (msg.type === 'leave-room') {
            const user = users.find(user => user.socket === socket);
            if (!user) return; 
            if (user.rooms.includes(msg.roomId)) {
                user.rooms = user.rooms.filter(r => r !== msg.roomId);
            };
            socket.leave(msg.roomId);
            console.log('users ', user);
            console.log('room leaving done');
        }

        if (msg.type === 'chat') {
            const roomId = msg.roomId;
            const message = msg.message; 

            //push data into the queue 

            await chatQueue.add('store-chat', {
                roomId, message, userId
            });
            console.log('inside chat');
            //chat addition to db
            // const chat_store = await prisma.chat.create({
            //     data: {
            //         roomId,
            //         message: message,
            //         userId: userId
            //     }
            // });

            users.forEach((user) => {
                console.log('this is user ', user.userId);
                console.log('this is roomId', roomId);
                if (user.rooms.includes(roomId)) { 
                    console.log('seding boy now to ', user.userId);

                    user.socket.emit(roomId, {
                        type: "chat",
                        roomId: roomId,
                        message:message
                    });
                }
            })
        }
        console.log('users ', users);
    })
    
    socket.on('disconnect', () => {
        console.log('user disconnected');
    })
});

server.listen(4001, () => console.log('server started successfully'));