'use client'
import React, { useEffect, useRef, useState } from 'react'
import { Socket } from 'socket.io-client';

type ShapeType = 'rect' | 'line' | 'circle' | 'triangle' | 'ellipse' | 'freehand';

type ChatPayload =
    | { shape: 'rect'; x: number; y: number; width: number; height: number }
    | { shape: 'line'; x1: number; y1: number; x2: number; y2: number }
    | { shape: 'circle'; cx: number; cy: number; r: number }
    | { shape: 'triangle'; x1: number; y1: number; x2: number; y2: number; x3: number; y3: number }
    | { shape: 'ellipse'; cx: number; cy: number; rx: number; ry: number }
    | { shape: 'freehand'; points: { x: number; y: number }[]; };
    ;

type ChatMessage = {
    type: 'chat';
    roomId: string;
    payload?: ChatPayload;
    id?: string;
    color?: string;
    message?: ChatPayload;
    strokeWidth?: number;
};

const Canvas = ({ socket }: { socket: Socket }) => {
    const [selectedShape, setSelectedShape] = useState<ShapeType>('rect');

    const canvas = useRef<HTMLCanvasElement | null>(null);
    const shapeRef = useRef<ShapeType>('rect');
    const zoomRef = useRef(1);
    const cameraXRef = useRef(0);
    const cameraYRef = useRef(0);
    
    const freePointsRef = useRef<{ x: number, y: number }[]>([]);


    const shapesRef = useRef<ChatMessage[]>([]);

    // ⭐ PAN STATE
    const isPanningRef = useRef(false);
    const panStartXRef = useRef(0);
    const panStartYRef = useRef(0);
    const camStartXRef = useRef(0);
    const camStartYRef = useRef(0);

    useEffect(() => {
        const canvas_el = canvas.current;
        if (!canvas_el) return;

        const ctx = canvas_el.getContext('2d');
        if (!ctx) return;

        // ---------------- DRAW SHAPES ----------------
        const chatShape = (msg: ChatMessage, context: CanvasRenderingContext2D) => {
            const p = msg.payload!;
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
                case 'freehand':
                    context.beginPath();
                    const pts = p.points;
                    if (pts.length > 0) {
                        context.moveTo(pts[0].x, pts[0].y);
                        for (let i = 1; i < pts.length; i++) {
                            context.lineTo(pts[i].x, pts[i].y);
                        }
                        context.stroke();
                    }
                    break;
            }
            context.restore();
        };

        // ---------------- RENDER EVERYTHING ----------------
        const rechatAll = (preview?: ChatMessage) => {
            const zoom = zoomRef.current;
            const camX = cameraXRef.current;
            const camY = cameraYRef.current;

            ctx.save();
            ctx.setTransform(zoom, 0, 0, zoom, -camX * zoom, -camY * zoom);

            ctx.clearRect(camX, camY, canvas_el.width / zoom, canvas_el.height / zoom);

            for (const s of shapesRef.current) {
                chatShape(s, ctx);
            }
            if (preview) chatShape(preview, ctx);

            ctx.restore();
        };

        // ---------------- SCREEN → WORLD ----------------
        const clientToCanvas = (clientX: number, clientY: number) => {
            const zoom = zoomRef.current;
            const camX = cameraXRef.current;
            const camY = cameraYRef.current;

            const rect = canvas_el.getBoundingClientRect();
            const sx = clientX - rect.left;
            const sy = clientY - rect.top;

            return {
                x: sx / zoom + camX,
                y: sy / zoom + camY
            };
        };

        // ------------------------------------------------------------
        // ⭐ DRAWING MODE (when left mouse is down)
        // ------------------------------------------------------------
        let startX = 0;
        let startY = 0;
        let isDrawing = false;
        let previewShape: ChatMessage | null = null;

        const onMouseDown = (e: MouseEvent) => {

            if (e.button === 1 || e.buttons === 4 || e.shiftKey) {
                // ⭐ Middle mouse OR SHIFT → PAN MODE
                isPanningRef.current = true;
                panStartXRef.current = e.clientX;
                panStartYRef.current = e.clientY;
                camStartXRef.current = cameraXRef.current;
                camStartYRef.current = cameraYRef.current;
                return;
            }

            if (shapeRef.current === 'freehand') {
                isDrawing = true;
                const { x, y } = clientToCanvas(e.clientX, e.clientY);

                freePointsRef.current = [{ x, y }];
                previewShape = {
                    type: 'chat',
                    roomId: '123',
                    payload: { shape: 'freehand', points: freePointsRef.current }
                };
                return;
            }

            // normal draw mode
            isDrawing = true;
            const { x, y } = clientToCanvas(e.clientX, e.clientY);
            startX = x;
            startY = y;
        };

        const onMouseMove = (e: MouseEvent) => {
            // ⭐ PANNING LOGIC
            if (isPanningRef.current) {
                const dx = (e.clientX - panStartXRef.current) / zoomRef.current;
                const dy = (e.clientY - panStartYRef.current) / zoomRef.current;

                cameraXRef.current = camStartXRef.current - dx;
                cameraYRef.current = camStartYRef.current - dy;

                rechatAll();
                return;
            }

            // DRAWING
            if (!isDrawing) return;

            
            const { x, y } = clientToCanvas(e.clientX, e.clientY);
            const shape = shapeRef.current;
            if (shape === 'freehand') {
                const { x, y } = clientToCanvas(e.clientX, e.clientY);

                freePointsRef.current.push({ x, y });

                previewShape = {
                    type: 'chat',
                    roomId: '123',
                    payload: { shape: 'freehand', points: [...freePointsRef.current] }
                };

                rechatAll(previewShape);
                return;
            }

            switch (shape) {
                case 'rect': {
                    previewShape = {
                        type: 'chat',
                        roomId: '123',
                        payload: { shape: 'rect', x: startX, y: startY, width: x - startX, height: y - startY }
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
                    previewShape = {
                        type: 'chat',
                        roomId: '123',
                        payload: { shape: 'circle', cx: startX, cy: startY, r: Math.sqrt(dx * dx + dy * dy) }
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
                    previewShape = {
                        type: 'chat',
                        roomId: '123',
                        payload: { shape: 'ellipse', cx: startX, cy: startY, rx: Math.abs(x - startX), ry: Math.abs(y - startY) }
                    };
                    break;
                }
            }

            rechatAll(previewShape || undefined);
        };

        const onMouseUp = () => {
            if (isPanningRef.current) {
                isPanningRef.current = false;
                return;
            }

            if (!isDrawing) return;
            isDrawing = false;

            if (shapeRef.current === 'freehand') {
                isDrawing = false;

                const finalMsg:ChatMessage = {
                    type: 'chat',
                    roomId: '123',
                    payload: { shape: 'freehand', points: [...freePointsRef.current] },
                    color: 'white',
                    strokeWidth: 2,
                };

                shapesRef.current.push(finalMsg);
                socket.emit('message', JSON.stringify(finalMsg));

                freePointsRef.current = [];
                previewShape = null;
                rechatAll();
                return;
            }

            if (previewShape) {
                previewShape.color = 'white';
                previewShape.strokeWidth = 2;
                shapesRef.current.push(previewShape);
                socket.emit('message', JSON.stringify(previewShape));
            }

            previewShape = null;
            rechatAll();
        };

        // ------------------------------------------------------------
        // ⭐ ZOOM (unchanged)
        // ------------------------------------------------------------
        canvas_el.addEventListener("wheel", e => {
            e.preventDefault();

            let zoom = zoomRef.current;
            let cameraX = cameraXRef.current;
            let cameraY = cameraYRef.current;

            // detect trackpad pan (excalidraw style)
            const isTrackpadPan = Math.abs(e.deltaX) > 0 || Math.abs(e.deltaY) < 50;

            if (isTrackpadPan && !e.ctrlKey) {
                // ⭐ TRACKPAD TWO-FINGER PANNING
                cameraX += e.deltaX / zoom;
                cameraY += e.deltaY / zoom;

                cameraXRef.current = cameraX;
                cameraYRef.current = cameraY;
                rechatAll();
                return;
            }

            // ⭐ ZOOM (ctrlKey on trackpad OR mouse wheel)
            const rect = canvas_el.getBoundingClientRect();
            const mouseX = e.clientX - rect.left;
            const mouseY = e.clientY - rect.top;

            const worldX = mouseX / zoom + cameraX;
            const worldY = mouseY / zoom + cameraY;

            const zoomFactor = 1.05;
            if (e.deltaY < 0) zoom *= zoomFactor;
            else zoom /= zoomFactor;

            zoom = Math.min(7, Math.max(0.05, zoom));

            cameraX = worldX - mouseX / zoom;
            cameraY = worldY - mouseY / zoom;

            zoomRef.current = zoom;
            cameraXRef.current = cameraX;
            cameraYRef.current = cameraY;

            rechatAll();
        }, { passive: false });



        // ------------------------------------------------------------
        // SOCKET EVENTS
        // ------------------------------------------------------------
        const socketHandler = (raw: any) => {
            let msg: ChatMessage | null = null;
            try {
                msg = typeof raw === 'string' ? JSON.parse(raw) : raw;
            } catch { return; }

            if (msg?.type !== 'chat') return;

            shapesRef.current.push(msg);
            rechatAll();
        };

        socket.on('message', socketHandler);

        // attach listeners
        canvas_el.addEventListener('mousedown', onMouseDown);
        canvas_el.addEventListener('mousemove', onMouseMove);
        window.addEventListener('mouseup', onMouseUp);

        return () => {
            canvas_el.removeEventListener('mousedown', onMouseDown);
            canvas_el.removeEventListener('mousemove', onMouseMove);
            window.removeEventListener('mouseup', onMouseUp);
            socket.off('message', socketHandler);
        };
    }, [socket]);

    return (
        <div>
            <div className="flex gap-2 bg-emerald-800 w-fit absolute top-0 left-1/2 -translate-x-1/2 p-2 rounded">

                <button
                    onClick={() => { shapeRef.current = 'rect'; setSelectedShape('rect'); }}
                    className={
                        selectedShape === 'rect'
                            ? "px-3 py-1 rounded bg-white text-black"
                            : "px-3 py-1 rounded bg-gray-700 text-white hover:bg-gray-500"
                    }>
                    Rect
                </button>

                <button
                    onClick={() => { shapeRef.current = 'line'; setSelectedShape('line'); }}
                    className={
                        selectedShape === 'line'
                            ? "px-3 py-1 rounded bg-white text-black"
                            : "px-3 py-1 rounded bg-gray-700 text-white hover:bg-gray-500"
                    }>
                    Line
                </button>

                <button
                    onClick={() => { shapeRef.current = 'circle'; setSelectedShape('circle'); }}
                    className={
                        selectedShape === 'circle'
                            ? "px-3 py-1 rounded bg-white text-black"
                            : "px-3 py-1 rounded bg-gray-700 text-white hover:bg-gray-500"
                    }>
                    Circle
                </button>

                <button
                    onClick={() => { shapeRef.current = 'triangle'; setSelectedShape('triangle'); }}
                    className={
                        selectedShape === 'triangle'
                            ? "px-3 py-1 rounded bg-white text-black"
                            : "px-3 py-1 rounded bg-gray-700 text-white hover:bg-gray-500"
                    }>
                    Triangle
                </button>

                <button
                    onClick={() => { shapeRef.current = 'ellipse'; setSelectedShape('ellipse'); }}
                    className={
                        selectedShape === 'ellipse'
                            ? "px-3 py-1 rounded bg-white text-black"
                            : "px-3 py-1 rounded bg-gray-700 text-white hover:bg-gray-500"
                    }>
                    Ellipse
                </button>

                <button
                    onClick={() => { shapeRef.current = 'freehand'; setSelectedShape('freehand'); }}
                    className={
                        selectedShape === 'freehand'
                            ? "px-3 py-1 rounded bg-white text-black"
                            : "px-3 py-1 rounded bg-gray-700 text-white hover:bg-gray-500"
                    }>
                    Freehand
                </button>

            </div>


            <canvas ref={canvas} width={window.innerWidth} height={window.innerHeight} className="bg-black" />
        </div>
    );
};

export default Canvas;
