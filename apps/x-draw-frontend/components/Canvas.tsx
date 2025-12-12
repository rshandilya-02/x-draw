'use client'
import React, { useEffect, useRef } from 'react'
import { Socket } from 'socket.io-client';


type ShapeType = 'rect' | 'line' | 'circle' | 'triangle' | 'ellipse';

type ChatPayload =
    | { shape: 'rect'; x: number; y: number; width: number; height: number }
    | { shape: 'line'; x1: number; y1: number; x2: number; y2: number }
    | { shape: 'circle'; cx: number; cy: number; r: number }
    | { shape: 'triangle'; x1: number; y1: number; x2: number; y2: number; x3: number; y3: number }
    | { shape: 'ellipse'; cx: number; cy: number; rx: number; ry: number };

type ChatMessage = {
    type: 'chat';
    roomId: string;
    payload?: ChatPayload;
    id?: string; // optional id if coming from DB
    color?: string;
    message?:ChatPayload
    strokeWidth?: number;
}

const Canvas = ({ socket }: { socket: Socket }) => {
    const canvas = useRef<HTMLCanvasElement | null>(null);
    const shapeRef = useRef<ShapeType>('rect');

    const shapesRef = useRef<ChatMessage[]>([]);

    useEffect(() => {
        const canvas_el = canvas.current;
        if (!canvas_el) return;

        const ctx = canvas_el.getContext('2d');
        if (!ctx) return;

        // initial base box
        const chatBase = () => {
            ctx.save();
            ctx.clearRect(0, 0, canvas_el.width, canvas_el.height);
            ctx.strokeStyle = 'white';
            ctx.lineWidth = 1;
            ctx.restore();
        };

        // helper: chat a single shape from payload
        const chatShape = (msg: ChatMessage, context: CanvasRenderingContext2D) => {
            let p = msg.message;
            if (typeof p === "string") {
                try {
                    p = JSON.parse(p);
                } catch (err) {
                    console.error("Invalid JSON message:", p);
                    return;
                }
            }
            if (!p) return;
            context.save();
            context.strokeStyle = msg.color || 'white';
            context.lineWidth = msg.strokeWidth ?? 2;

            switch (p.shape) {
                case 'rect':
                    context.strokeRect(p.x, p.y, p.width, p.height);
                    break;
                case 'line':
                    context.beginPath();
                    context.moveTo(p.x1, p.y1);
                    context.lineTo(p.x2, p.y2);
                    context.stroke();
                    break;
                case 'circle':
                    context.beginPath();
                    context.arc(p.cx, p.cy, p.r, 0, Math.PI * 2);
                    context.stroke();
                    break;
                case 'triangle':
                    context.beginPath();
                    context.moveTo(p.x1, p.y1);
                    context.lineTo(p.x2, p.y2);
                    context.lineTo(p.x3, p.y3);
                    context.closePath();
                    context.stroke();
                    break;
                case 'ellipse':
                    context.beginPath();
                    context.ellipse(p.cx, p.cy, p.rx, p.ry, 0, 0, Math.PI * 2);
                    context.stroke();
                    break;
                default:
                    break;
            }
            context.restore();
        };

        const rechatAll = (preview?: ChatMessage) => {
            chatBase();
            for (const s of shapesRef.current) {
                chatShape(s, ctx);
            }
            if (preview) chatShape(preview, ctx);
        };


        const clientToCanvas = (clientX: number, clientY: number) => {
            const rect = canvas_el.getBoundingClientRect();
            const x = clientX - rect.left;
            const y = clientY - rect.top;
            return { x, y };
        };

        let startX = 0;
        let startY = 0;
        let isChating = false;
        let previewShape: ChatMessage | null = null;

        const onMouseDown = (e: MouseEvent) => {
            isChating = true;
            const { x, y } = clientToCanvas(e.clientX, e.clientY);
            startX = x;
            startY = y;
        };

        const onMouseMove = (e: MouseEvent) => {
            if (!isChating) return;
            const { x, y } = clientToCanvas(e.clientX, e.clientY);
            const shape = shapeRef.current;

            switch (shape) {
                case 'rect': {
                    const width = x - startX;
                    const height = y - startY;
                    previewShape = {
                        type: 'chat',
                        roomId: '123',
                        payload: { shape: 'rect', x: startX, y: startY, width, height }
                    };
                    break;
                }
                case 'line': {
                    previewShape = {
                        type: 'chat',
                        roomId: '123',
                        payload: { shape: 'line', x1: startX, y1: startY, x2: x, y2: y }
                    };
                    break;
                }
                case 'circle': {
                    const dx = x - startX;
                    const dy = y - startY;
                    const r = Math.sqrt(dx * dx + dy * dy);
                    previewShape = {
                        type: 'chat',
                        roomId: '123',
                        payload: { shape: 'circle', cx: startX, cy: startY, r }
                    };
                    break;
                }
                case 'triangle': {
                    previewShape = {
                        type: 'chat',
                        roomId: '123',
                        payload: {
                            shape: 'triangle',
                            x1: startX, y1: startY,
                            x2: x, y2: y,
                            x3: startX, y3: y
                        } 
                    };
                    break;
                }
                case 'ellipse': {
                    const rx = Math.abs(x - startX);
                    const ry = Math.abs(y - startY);
                    previewShape = {
                        type: 'chat',
                        roomId: '123',
                        payload: { shape: 'ellipse', cx: startX, cy: startY, rx, ry }
                    };
                    break;
                }
                default:
                    previewShape = null;
            }

            rechatAll(previewShape || undefined);
        };

        const onMouseUp = (e: MouseEvent) => {
            if (!isChating) return;
            isChating = false;
            const { x, y } = clientToCanvas(e.clientX, e.clientY);
            const shape = shapeRef.current;
            let finalMsg: ChatMessage | null = null;

            switch (shape) {
                case 'rect': {
                    const width = x - startX;
                    const height = y - startY;
                    finalMsg = { type: 'chat', roomId: '123', payload: { shape: 'rect', x: startX, y: startY, width, height } };
                    break;
                }
                case 'line': {
                    finalMsg = { type: 'chat', roomId: '123', payload: { shape: 'line', x1: startX, y1: startY, x2: x, y2: y } };
                    break;
                }
                case 'circle': {
                    const dx = x - startX;
                    const dy = y - startY;
                    const r = Math.sqrt(dx * dx + dy * dy);
                    finalMsg = { type: 'chat', roomId: '123', payload: { shape: 'circle', cx: startX, cy: startY, r } };
                    break;
                }
                case 'triangle': {
                    finalMsg = {
                        type: 'chat',
                        roomId: '123',
                        payload: {
                            shape: 'triangle',
                            x1: startX, y1: startY,
                            x2: x, y2: y,
                            x3: startX, y3: y
                        } 
                    };
                    break;
                }
                case 'ellipse': {
                    const rx = Math.abs(x - startX);
                    const ry = Math.abs(y - startY);
                    finalMsg = { type: 'chat', roomId: '123', payload: { shape: 'ellipse', cx: startX, cy: startY, rx, ry } };
                    break;
                }
                default:
                    finalMsg = null;
            }

            if (finalMsg) {
                finalMsg.color = 'white';
                finalMsg.strokeWidth = 2;

                shapesRef.current.push(finalMsg);
                rechatAll();

                
                socket.emit('message', JSON.stringify(finalMsg));
            }

            // clear preview
            previewShape = null;
        };

        const socketHandler = (raw: any) => {
          
            console.log('this is raw ', raw);
            let msg: ChatMessage | null = null;
            try {
                if (typeof raw === 'string') msg = JSON.parse(raw);
                else msg = raw;
            } catch (err) {
                return;
            }

            if (!msg || msg.type !== 'chat') return;

            // store and rechat
            shapesRef.current.push(msg);
            rechatAll();
        };

        // attach canvas listeners
        canvas_el.addEventListener('mousedown', onMouseDown);
        canvas_el.addEventListener('mousemove', onMouseMove);
        window.addEventListener('mouseup', onMouseUp); // use window so mouseup outside canvas still registers

        socket.on('message', socketHandler);

        socket.on('123', socketHandler);

        


        return () => {
            canvas_el.removeEventListener('mousedown', onMouseDown);
            canvas_el.removeEventListener('mousemove', onMouseMove);
            window.removeEventListener('mouseup', onMouseUp);

            socket.off('message', socketHandler);
            socket.off('chat', socketHandler);
            socket.off('123', socketHandler);

        };
    }, [canvas, socket]);

    const handleClear = () => {
        const c = canvas.current;
        if (!c) return;
        const ctx = c.getContext('2d');
        if (!ctx) return;
        const shapes = shapesRef.current;
        shapes.length = 0;
        ctx.clearRect(0, 0, c.width, c.height);
        ctx.strokeStyle = 'white';
        ctx.strokeRect(10, 10, 450, 450);

        
    };

    return (
        <div>
            <div style={{ display: 'flex', gap: 8, padding: 8 }} className='flex bg-emerald-800 w-fit absolute top-0 left-[50%] -translate-x-[50%]'>
                <button onClick={() => (shapeRef.current = 'rect')}>Rectangle</button>
                <button onClick={() => (shapeRef.current = 'line')}>Line</button>
                <button onClick={() => (shapeRef.current = 'circle')}>Circle</button>
                <button onClick={() => (shapeRef.current = 'triangle')}>Triangle</button>
                <button onClick={() => (shapeRef.current = 'ellipse')}>Ellipse</button>
                <button onClick={handleClear}>Clear</button>
            </div>

            <canvas id="canvas" width="1580" height="850" className='' ref={canvas}>
                current stock price: $3.15 + 0.15
            </canvas>
        </div>
    )
}

export default Canvas
