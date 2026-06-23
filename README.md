# Корпоративный мессенджер (Vue 3 + Firebase)

Корпоративный мессенджер на базе **Vue 3**, **TypeScript**, **Pinia**, **Tailwind CSS** и **Firebase**.

---

## Возможности

- **Обмен сообщениями в реальном времени** через Firebase Firestore (live-подписки)
- **Аутентификация** — регистрация и вход по email/паролю через Firebase Auth
- **Личные и групповые чаты** — создание приватных чатов и групп с названием и аватаром
- **Медиавложения** — отправка изображений, видео, аудио и файлов (загрузка через Cloudinary)
- **Действия с сообщениями** — редактирование, удаление, ответ, пересылка, множественный выбор
- **AI-перегенерация текста** — переформулировка текста сообщения в корпоративный стиль через внешний AI API (GigaChat)
- **Счётчики непрочитанных** сообщений по каждому чату
- **Статус присутствия** — отслеживание онлайн/офлайн пользователей
- **Тёмная / светлая тема** с кастомным пресетом PrimeVue Aura (оранжевая палитра)
- **Мобильный интерфейс** — свайп для ответа и навигации назад
- **Безопасность ввода** — XSS-санитизация через DOMPurify, rate limiting, валидация Zod
- **Виртуальный скролл** для плавного отображения больших списков сообщений
- **Эмодзи-пикер** в поле ввода сообщения
- **Поддержка Firebase Emulator** для локальной разработки

---

## Технологии

### Frontend


| Технология              | Назначение                                          |
| ----------------------- | --------------------------------------------------- |
| Vue 3 (Composition API) | UI-фреймворк                                        |
| TypeScript              | Типобезопасность                                    |
| Pinia                   | Управление состоянием                               |
| Vue Router 4            | Клиентская маршрутизация с навигационными guard-ами |
| Tailwind CSS 4          | Утилитарные стили                                   |
| PrimeVue 4 + PrimeIcons | Библиотека UI-компонентов                           |
| VueUse                  | Composable-утилиты                                  |
| Zod                     | Валидация схем                                      |
| isomorphic-dompurify    | XSS-санитизация                                     |
| vue3-emoji-picker       | Выбор эмодзи                                        |
| vue-virtual-scroller    | Виртуальный список                                  |
| Vite 7                  | Инструмент сборки                                   |


### Бэкенд / Сервисы


| Сервис             | Назначение                                              |
| ------------------ | ------------------------------------------------------- |
| Firebase Auth      | Аутентификация пользователей                            |
| Firebase Firestore | База данных реального времени                           |
| Firebase Storage   | Хранение файлов (аватары и др.)                         |
| Cloudinary         | Загрузка медиафайлов (изображения, видео, аудио, файлы) |
| Внешний AI API     | Перефраз текста сообщений                               |


---

## Структура проекта

Проект следует архитектуре **Feature-Sliced Design (FSD)**:

```
src/
├── app/          # Точка входа, роутер, провайдеры стора, конфигурация темы
├── pages/        # Страницы маршрутов (main, auth, chat)
├── widgets/      # Составные UI-блоки (ChatList, ChatHeader, MessageInput, ...)
├── features/     # Пользовательские действия (send-message, message-actions, chat-actions, ai-rewrite, ...)
├── entities/     # Доменные модели и сторы (chat, message, user)
└── shared/       # Переиспользуемые утилиты, composables, типы, API-клиенты
```

---

## Переменные окружения

Скопируйте `.env.example` в `.env.local` и заполните свои данные:

```env
# Firebase
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=
VITE_FIREBASE_MEASUREMENT_ID=

# Cloudinary (unsigned upload preset)
VITE_CLOUDINARY_CLOUD_NAME=
VITE_CLOUDINARY_UPLOAD_PRESET=

# AI rewrite endpoint
VITE_AI_API_URL=/api/rewrite

# Опционально: включить Firebase Emulator Suite
VITE_USE_FIREBASE_EMULATORS=false
```

---

## Запуск

```bash
# Установить зависимости
npm install
```

# Запустить dev-сервер
npm run dev
```

Фронтенд доступен по адресу `http://localhost:5173`.

При включённых Firebase Emulators приложение подключается к:

- Auth: `http://localhost:9099`
- Firestore: `localhost:8080`
- Storage: `localhost:9199`

---

## Лимиты загрузки файлов


| Тип                      | Лимит                |
| ------------------------ | -------------------- |
| Изображения              | 5 МБ                 |
| Видео                    | 2 ГБ                 |
| Прочие файлы             | 100 МБ               |
| Файлов в одном сообщении | 10                   |
| Частота загрузки         | 10 загрузок / минуту |


---

## Сборка

```bash
npm run build
```

Результат сборки помещается в директорию `dist/`.

---

---

---

---

---

# Corporate Messenger (Vue 3 + Firebase)

Corporate messenger built with **Vue 3**, **TypeScript**, **Pinia**, **Tailwind CSS**, and **Firebase** as the backend.

---

## Features

- **Real-time messaging** via Firebase Firestore (live listeners)
- **Authentication** — email/password registration and login via Firebase Auth
- **Direct and group chats** — create private chats or groups with a custom name and avatar
- **Media attachments** — send images, videos, audio, and files (uploaded to Cloudinary)
- **Message actions** — edit, delete, reply, forward, and select multiple messages
- **AI text rewrite** — rephrase message text to match the corporate style via an external AI API (GigaChat)
- **Unread message counters** per chat
- **User presence** — online/offline status tracking
- **Dark / light theme** with a custom PrimeVue Aura preset (orange palette)
- **Mobile-friendly** UI with swipe-to-reply and swipe-back navigation
- **Input security** — XSS sanitization via DOMPurify, rate limiting, Zod validation
- **Virtual scroll** for smooth rendering of large message lists
- **Emoji picker** in the message input
- **Firebase Emulator** support for local development

---

## Tech Stack

### Frontend


| Technology              | Purpose                                    |
| ----------------------- | ------------------------------------------ |
| Vue 3 (Composition API) | UI framework                               |
| TypeScript              | Type safety                                |
| Pinia                   | State management                           |
| Vue Router 4            | Client-side routing with navigation guards |
| Tailwind CSS 4          | Utility-first styling                      |
| PrimeVue 4 + PrimeIcons | UI component library                       |
| VueUse                  | Composable utilities                       |
| Zod                     | Schema validation                          |
| isomorphic-dompurify    | XSS sanitization                           |
| vue3-emoji-picker       | Emoji input                                |
| vue-virtual-scroller    | Virtual list rendering                     |
| Vite 7                  | Build tool                                 |


### Backend / Services


| Service            | Purpose                                    |
| ------------------ | ------------------------------------------ |
| Firebase Auth      | User authentication                        |
| Firebase Firestore | Real-time database                         |
| Firebase Storage   | File storage (avatars, etc.)               |
| Cloudinary         | Media upload (images, video, audio, files) |
| External AI API    | Message text rewriting                     |


---

## Project Structure

The project follows **Feature-Sliced Design (FSD)**:

```
src/
├── app/          # App entry, router, store providers, theme config
├── pages/        # Route-level pages (main, auth, chat)
├── widgets/      # Composite UI blocks (ChatList, ChatHeader, MessageInput, ...)
├── features/     # User interactions (send-message, message-actions, chat-actions, ai-rewrite, ...)
├── entities/     # Domain models and stores (chat, message, user)
└── shared/       # Reusable utils, composables, types, API clients
```

---

## Environment Variables

Copy `.env.example` to `.env.local` and fill in your credentials:

```env
# Firebase
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=
VITE_FIREBASE_MEASUREMENT_ID=

# Cloudinary (unsigned upload preset)
VITE_CLOUDINARY_CLOUD_NAME=
VITE_CLOUDINARY_UPLOAD_PRESET=

# AI rewrite endpoint
VITE_AI_API_URL=/api/rewrite

# Optional: enable Firebase Emulator Suite
VITE_USE_FIREBASE_EMULATORS=false
```

---

## Getting Started

```bash
# Install dependencies
npm install

# Start the dev server
npm run dev
```

The frontend runs at `http://localhost:5173`.

With Firebase Emulators enabled, the app connects to:

- Auth emulator: `http://localhost:9099`
- Firestore emulator: `localhost:8080`
- Storage emulator: `localhost:9199`

---

## Media Upload Limits


| Type              | Limit               |
| ----------------- | ------------------- |
| Images            | 5 MB                |
| Videos            | 2 GB                |
| Other files       | 100 MB              |
| Files per message | 10                  |
| Upload rate       | 10 uploads / minute |


---

## Build

```bash
npm run build
```

Output is placed in the `dist/` directory.
