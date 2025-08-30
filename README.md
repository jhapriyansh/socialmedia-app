# SocialMedia-App 📱

A modern social media web application built with React, Vite, Tailwind CSS, and Socket.IO. Features include user authentication, real-time chat, notifications, posts, comments, likes, follow requests, and more.

## Features ✨

- User registration & login 📝
- Light/Dark theme toggle 🌓
- Create, like, save, and comment on posts (image/video) 🖼️
- Follow/unfollow users, private/public profiles 👀
- Real-time notifications and chat using Socket.IO ⚡
- Responsive layout with left/right sidebars ↔️
- Profile editing, followers/following modals 👤
- Activity feed, liked & saved posts ❤️🔖
- Online friends indicator 🟢

## Tech Stack 💻

- [React](https://react.dev/) ⚛️
- [Vite](https://vitejs.dev/) ⚡
- [Tailwind CSS](https://tailwindcss.com/) 🎨
- [Socket.IO](https://socket.io/) 💬
- [Axios](https://axios-http.com/) 🌐
- [React Router](https://reactrouter.com/) 🛣️
- [Material UI Icons](https://mui.com/material-ui/material-icons/) ✨
- [React Toastify](https://fkhadra.github.io/react-toastify/) 🍞

## Getting Started 🚀

### Prerequisites

- Node.js (v16+ recommended)
- npm

### Installation

1.  **Clone the repository:**

    ```sh
    git clone https://github.com/jhapriyansh/socialmedia-app
    cd SocialMedia-App/Frontend
    ```

2.  **Install dependencies:**

    ```sh
    npm install
    ```

3.  **Set up environment variables:**

    Create a `.env` file in the root directory and add:

    ```
    VITE_API_URL=http://localhost:8000
    VITE_WS_URL=ws://localhost:8000
    ```

4.  **Start the development server:**

    ```sh
    npm run dev
    ```

    The app will be available at [http://localhost:5173](https://www.google.com/search?q=http://localhost:5173) by default. ✅

### Build for Production

```sh
npm run build
```

### Lint the Code

```sh
npm run lint
```

## Project Structure 📂

```
src/
  App.jsx
  Layout.jsx
  main.jsx
  index.css
  assets/
  components/
  context/
  pages/
  socketConnection.js
public/
  vite.svg
index.html
tailwind.config.js
vite.config.js
postcss.config.js
```

## Customization ⚙️

- **Theme:** Toggle between light and dark mode using the button in the UI. ☀️🌙
- **API URLs:** Change API endpoints in your `.env` file. 🔗
- **Assets:** Update images in `src/assets/` as needed. 📁

## License 📄

This project is for educational purposes.

---

**Note:** This is the frontend only. You need a compatible backend API for full functionality. A compatible backend can be found [here](https://www.google.com/search?q=https://github.com/jhapriyansh/socialmedia-app). 🤝
