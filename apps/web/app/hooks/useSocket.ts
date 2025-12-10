import { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";

const SOCKET_URL = 'http://localhost:4001';
const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImE4YWQzMDVjLTcyYmYtNGU3Mi05YjM0LWM2NDYxNmViOGRmOCIsInVzZXJuYW1lIjoic2hhbmRpbHlhLnJpc2hhYmgxMTdAZ21haWwuY29tIiwicGhvdG8iOm51bGwsImlhdCI6MTc2NTM3Nzc4Mn0.tyesjiKPxgN6W7uxE5j2lWNs0sS7ervjfamiO6iwWAw";

type UseSocketReturn = {
    socket: Socket | undefined;
    loading: boolean;
};

export function useSocket():UseSocketReturn {
    const [loading, setLoading] = useState(true);
    const [socket, setSocket] = useState<Socket>();

    useEffect(() => {
        const socket_client = io(`${SOCKET_URL}`, {
            reconnectionDelayMax: 10000,
            query: {
                "token": token
            }
        });
        console.log('this is socket_client ', socket_client);
        setSocket(socket_client);
        setLoading(false);
        // socket_client.on('connect', () => {
        //     console.log('a user connected');
        //     console.log(socket_client.id);
        // })
        return () => {
            socket_client.disconnect();
        }
    }, []);

    return { socket, loading };

}

