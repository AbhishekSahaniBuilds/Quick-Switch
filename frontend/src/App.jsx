import "./css/App.css";
import Home from "./components/pages/home/Home";
import Chat from "./components/pages/bot_pages/chat/Chat";
import AskModel from "./components/pages/bot_pages/ask_model/AskModel";
import Settings from "./components/pages/settings/Settings";

import { createBrowserRouter, RouterProvider } from "react-router-dom";

const router = createBrowserRouter(
  [
    {
      path: "/",
      element: <Home />,
    },
    {
      path: "/chat/:provider/:creator/:modelId/:modelName",
      element: <Chat />,
    },
    {
      path: "/model",
      element: <AskModel />,
    },
    {
      path: "/settings",
      element: <Settings />,
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
