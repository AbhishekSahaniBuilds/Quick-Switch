import "./css/App.css";
import Home from "./components/pages/home/Home";
import Chat from "./components/pages/bot_pages/chat/Chat";
import AskModel from "./components/pages/bot_pages/ask_model/AskModel";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

const router = createBrowserRouter(
  [
    {
      path: "/",
      element: <Home />,
    },
    {
      //  Updated to match the three distinct parameter tokens
      path: "/chat/:provider/:creator/:modelId",
      element: <Chat />,
    },
    {
      path: "/model",
      element: <AskModel />,
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
