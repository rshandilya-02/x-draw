'use client';

import Canvas from '@/components/Canvas';
import { useSocket } from '@/hooks/socket';
import React, { useEffect, useRef } from 'react'

const RoomClient = () => {
    // current selected shape
    

    const { loading, setLoading, socket } = useSocket();
    console.log('this is loading', loading);
    useEffect(() => {
        if (!socket) return;
        socket.on("connect", () => {
            setLoading(false);
            console.log('socket id is ', socket.id);
            socket.emit('message', JSON.stringify({
                roomId: "123",
                type: "join-room"
            }))
        });
        
        return () => {
            socket.off('connect');
            socket.disconnect();
        }
    }, [socket]);
    
    if (loading) return <div>Loading...</div>;
    
    

    return (
        <div>
            <Canvas socket={socket}></Canvas>
        </div>
    )
}

export default RoomClient
