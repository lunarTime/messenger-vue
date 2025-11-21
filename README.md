# 💬 Real-Time Messenger (Vue 3 + WebSocket)

A minimal, fast and scalable real-time messenger built with **Vue 3**, **TypeScript**, **Pinia**, **Tailwind**, and a lightweight **Node.js WebSocket backend**.

---

## 🚀 Features

- ⚡ **Real-time messaging** via native WebSocket  
- 👤 **Persistent user IDs** stored locally  
- 💬 **Chat creation on demand**  
- 📡 **Online/offline user presence**  
- 📁 **File-based JSON storage** on backend
- 🧩 **Modular architecture** following SOLID principles  
- 🎨 **Modern UI** using Tailwind
- 🔧 **Scalable structure** ready for growth
---

## 🖥️ Development stack

### **Frontend**
- Vue 3 (Composition API)
- TypeScript
- Pinia
- Tailwind
- Vite

### **Backend**
- Node.js (nodemon)
- WebSocket server (ws)
- JSON-based persistence
---

## 🛠️ Development setup

###  Install dependencies on Client and Server folders
```bash
npm install

npm run dev

```

##

The WebSocket server runs on:
ws://localhost:8080

The frontend runs on:
http://localhost:5173

## 💬 How to start chatting

After installing dependencies and running both the client and the server:

- Open two different browsers or incognito mode to simulate two users.

- Go to the chat page and enter the user ID of the person you want to talk to in the search field.

- Send the first message - the chat will be created automatically, and both users will start receiving real-time messages.
