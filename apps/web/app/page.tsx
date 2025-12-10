'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

const page = () => {
  const [roomId, setRoomId] = useState('');

  const router = useRouter();

  return (
    <div className='container'>
      <label htmlFor="roomId">Enter your RoomId</label>
      <input type="text" id="roomId" onChange={(e) => setRoomId(e.target.value)} />
      
      <button onClick={()=>router.push(`/room/${roomId}`)}>enter room</button>
    </div>
  )
}

export default page