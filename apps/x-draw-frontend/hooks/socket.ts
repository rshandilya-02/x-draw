'use client';

import { useEffect, useState } from "react";
import { io } from "socket.io-client";

const WS_URL = "http://localhost:4001";

export const useSocket = () => {
    const [socket, setSocket] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem("x-draw-token") || "";

        const s = io(`${WS_URL}?token=${token}`);
        setSocket(s);

        // s.on("connect", () => setLoading(false));

        return () => {
            s.disconnect();
        };
    }, []);

    return { socket, loading,setLoading };
};
