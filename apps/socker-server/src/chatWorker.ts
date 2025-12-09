import dotenv from 'dotenv';
dotenv.config();

import IORedis from 'ioredis';




import { prisma } from '@repo/db';


import { Worker } from 'bullmq';
import { Prisma } from '@repo/db';

const connection = new IORedis({ maxRetriesPerRequest: null });
const worker = new Worker('chat-queue', async (job) => {
    if (job.name === 'store-chat') {
        const { roomId, message, userId } = job.data as { roomId: number, message: string, userId: string };
        const data = await prisma.chat.create({
            data: {
                roomId:Number(roomId),
                message,
                userId
            }
        });
        
        console.log('chat created in db ', data);
    }
}, { connection });


worker.on('completed', job => {
    console.log('job created successfully ', job);
})

worker.on('failed', (job, err) => {
    
    console.log(`${job?.id} has failed with ${err.message}`);
})