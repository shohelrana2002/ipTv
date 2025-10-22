import { createBrowserRouter } from "react-router";
import Home from "../components/Home/Home";
import LiveTVApp from "../components/ReactTv/LiveTv";
import Root from "../Root/Root";
import About from "../components/About/About";
import Contact from "../components/Contact/Contact";
import Dashboard from "../Root/Dashboard";
import AllChannel from "../Pages/AllChannel/AllChannel";
import Login from "../Pages/Login/Login";
import Register from "../Pages/Register/Register";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Root,
    children: [
      {
        index: true,
        Component: Home,
      },
      {
        path: "/liveTv",
        Component: LiveTVApp,
      },
      {
        path: "/about",
        Component: About,
      },
      {
        path: "/contact",
        Component: Contact,
      },
    ],
  },
  {
    path: "/dashBoard",
    Component: Dashboard,
  },
  {
    path: "/dashBoard/allChannel",
    Component: AllChannel,
  },

  {
    path: "/login",
    Component: Login,
  },
  {
    path: "/register",
    Component: Register,
  },
]);
