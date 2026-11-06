import "./css/App.css";
import Home from "./components/pages/home/Home";
import Chat from "./components/pages/chat/Chat";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

const router = createBrowserRouter(
  [
    {
      path: "/",
      element: <Home />,
    },
    {
      path: "/chat",
      element: <Chat />,
    },
  ],
  {
    basename: "/Quick-Switch",
  },
);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
