# 💬 Real-Time Messenger (Vue 3 + Firebase)

Fast and scalable real-time messenger built with **Vue 3**, **PrimeVue**, **Tailwind**, **Pinia**, **TypeScript**, and **Firebase**.

---

## 🚀 Features
- ⚡ **Real-time messaging** on Firebase (Firestore / Realtime Database listeners)
- 🔐 **Authentication** powered by Firebase Authentication
- 📡 **Online/offline presence and read status** through Firebase data updates
- 📁 **Cloud storage** for message attachments via Firebase Storage
- 🧩 **FSD** architecture to keep business logic and UI scalable and maintainable
- 🎨 **Modern UI** with PrimeVue components styled by Tailwind utility classes
- 🔧 **Production-ready** structure with strict typing and state via Pinia
---

## 🖥️ Development stack

### **Frontend**
- Vue 3 (Composition API, setup)
- TypeScript
- Pinia
- PrimeVue
- Tailwind
- Vite

### **Backend**
- Firebase Authentication (email/password or Google)
- Firebase Firestore / Realtime Database (messages, chats, presence)
- Firebase Storage (files, avatars)

---

## 🛠️ Development setup

###  1. Install dependencies

```bash
npm install
```

###  2. Configure Firebase

Create a Firebase project and enable Authentication + Firestore.

Create a `.env` file with Firebase config (see `.env.example`). All variables should use the `VITE_` prefix to be available in the app. 

Make sure Firebase SDK is initialized.

### 3. Start app

```bash
npm run dev
```
---

## 💬 How to start chatting

After installing dependencies and configuring Firebase:

- Sign in (email/password or Google).
- Create or select a chat in the chats list.
- Send a message - it will appear in real time on all devices connected to the same chat, thanks to Firebase listeners.
- Open the app in another browser/incognito window under a different account to test real-time messaging, presence, and read status between two users.


