# X-Draw 🎨

A scalable, real-time collaborative whiteboard inspired by Excalidraw, built from scratch using HTML Canvas and WebSockets.

X-Draw allows multiple users to draw simultaneously on a shared infinite canvas with low latency. The project was designed to explore real-world system design concepts such as event-driven architectures, asynchronous persistence, scalable backend services, and monorepo development.

---

# Features

- ✏️ Real-time collaborative drawing
- 👥 Room-based collaboration
- 🔐 JWT Authentication
- 🎨 Multiple drawing tools
  - Rectangle
  - Circle
  - Line
  - Pencil
  - Text
- ♾️ Infinite canvas
- 🔍 Zoom & Pan
- ⚡ Low-latency synchronization using Socket.IO
- 💾 Automatic drawing persistence
- 📜 Canvas history restoration
- 📱 Responsive UI
- 🏗 Monorepo architecture

---

# Tech Stack

## Frontend

- Next.js
- React
- TypeScript
- HTML Canvas API
- TailwindCSS

## Backend

- Node.js
- Express.js
- Socket.IO
- JWT Authentication

## Database

- PostgreSQL
- Prisma ORM
- Neon Database

## Queue System

- Redis
- BullMQ

## DevOps

- Docker
- Turborepo
- PNPM Workspace

---

# Project Architecture

```text
                    +----------------+
                    |   Next.js App  |
                    +-------+--------+
                            |
                     HTTP / WebSocket
                            |
             +--------------+--------------+
             |                             |
     +-------v-------+             +-------v-------+
     | HTTP Backend  |             | Socket Server |
     +-------+-------+             +-------+-------+
             |                             |
             |                      Broadcast Events
             |                             |
             +--------------+--------------+
                            |
                     BullMQ Queue
                            |
                          Redis
                            |
                    Background Worker
                            |
                         PostgreSQL
```

---

# Why BullMQ?

A drawing session can generate thousands of events. Writing each event directly to PostgreSQL would significantly increase database load and reduce responsiveness.

Instead:

1. The Socket.IO server instantly broadcasts drawing events to connected users.
2. Events are queued using BullMQ.
3. Background workers consume the queue and persist data asynchronously.
4. Users experience smooth, real-time collaboration while database writes remain efficient.

This architecture reduces latency and scales much better as the number of concurrent users grows.

---

# Folder Structure

```text
apps/
    web/
    http-backend/
    ws-backend/

packages/
    common/
    db/

docker/

turbo.json
pnpm-workspace.yaml
```

---

# Real-Time Flow

```text
User Draws
      │
      ▼
Canvas Event
      │
      ▼
Socket.IO Server
      │
      ├────────────► Broadcast to Connected Users
      │
      ▼
BullMQ Queue
      │
      ▼
Worker
      │
      ▼
PostgreSQL
```

---

# Authentication

- JWT-based authentication
- Protected collaboration rooms
- Secure REST APIs
- User-specific sessions

---

# Challenges Faced

### Real-Time Synchronization

Maintaining a consistent canvas state across multiple users while keeping latency low required efficient WebSocket communication and event handling.

### Database Load

Saving every mouse movement directly to PostgreSQL generated excessive write operations.

**Solution**

- Redis
- BullMQ
- Background Workers

### Infinite Canvas

Implemented camera transformations to support:

- Zoom
- Pan
- Coordinate conversion
- Infinite workspace

### Monorepo Development

Used Turborepo to share:

- Common types
- Utility functions
- Database client
- Build configuration

---

# Scalability Considerations

The architecture is designed to support:

- Independent HTTP and WebSocket services
- Horizontal scaling of Socket.IO servers
- Queue-based asynchronous persistence
- Stateless backend services
- Shared packages using Turborepo

---

# Future Improvements

- Cursor presence
- Shape selection & editing
- Undo / Redo
- Image uploads
- Sticky notes
- Voice collaboration
- Version history
- CRDT-based synchronization
- Kubernetes deployment
- AWS infrastructure
- Monitoring with Prometheus & Grafana

---

# Installation

```bash
git clone https://github.com/yourusername/x-draw.git
```

```bash
pnpm install
```

```bash
docker compose up
```

```bash
pnpm dev
```

---

# Environment Variables

```env
DATABASE_URL=

JWT_SECRET=

REDIS_URL=

NEXT_PUBLIC_BACKEND_URL=

NEXT_PUBLIC_WS_URL=
```

---

# Learning Outcomes

Through this project, I gained hands-on experience with:

- Real-time collaboration systems
- WebSocket communication
- Event-driven architecture
- Redis & BullMQ
- Queue-based processing
- Prisma ORM
- PostgreSQL
- Monorepo development with Turborepo
- Docker
- JWT Authentication
- HTML Canvas rendering
- Backend scalability
- Performance optimization
- System Design

---

# Author

**Rishabh Shandilya**

Software Engineer
