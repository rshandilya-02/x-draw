'use client';

import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useSocket } from '../hooks/useSocket';

const RoomChat = ({ roomId }: { roomId: string }) => {
    const [message, setMessage] = useState<string[]>([]);
    const BACKEND_URL = "http://localhost:4000";


    const { socket, loading } = useSocket();


    const fetchPrevPosts = async () => {
        const message = await axios.get(`${BACKEND_URL}/fetchChats/${roomId}`, {
            headers: {
                authorization:"Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImE4YWQzMDVjLTcyYmYtNGU3Mi05YjM0LWM2NDYxNmViOGRmOCIsInVzZXJuYW1lIjoic2hhbmRpbHlhLnJpc2hhYmgxMTdAZ21haWwuY29tIiwicGhvdG8iOm51bGwsImlhdCI6MTc2NTM3Nzc4Mn0.tyesjiKPxgN6W7uxE5j2lWNs0sS7ervjfamiO6iwWAw"
            }
        });
        console.log('message received', message.data.data);
        setMessage(message.data.data);
    };

    useEffect(() => {
        fetchPrevPosts();
        console.log('thsi is socket',socket);
        if (socket && !loading) {
            socket.on('connect', () => {
                console.log('a user connected');
                console.log(socket.id);
                socket.emit("message", {
                    type: "join-room",
                    roomId: roomId
                });
            });
            socket.on(roomId, (msg) => {
                console.log('message on client', msg);
                setMessage((prev) => [...prev, msg]);
            })
        };
    },[socket,loading,roomId]);
  return (
      <div>

          RoomChat {JSON.stringify(roomId)}
          {message && message.length>0 && message.map((item,index) => {
              return <div key={index}>{JSON.stringify(item)}</div>
          })}
          
      </div>
  )
}

export default RoomChat