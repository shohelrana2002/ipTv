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
import PrivateRoutes from "./PrivateRoutes";
import ChannelForm from "../Pages/ChannelForm/ChannelForm";
import AllUsers from "../Pages/AllUsers/AllUsers";
import NotFound from "../components/NotFound/NotFound";
import WatchTime from "../Pages/WatchTime/WatchTime";

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
        path: "/liveTv/:slug",
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
    element: (
      <PrivateRoutes>
        <Dashboard />
      </PrivateRoutes>
    ),
  },
  {
    path: "/dashBoard/channelAdd",
    element: (
      <PrivateRoutes>
        <ChannelForm />
      </PrivateRoutes>
    ),
  },
  {
    path: "/dashBoard/allChannel",
    element: (
      <PrivateRoutes>
        <AllChannel />
      </PrivateRoutes>
    ),
  },
  {
    path: "/dashBoard/allUsers",
    element: (
      <PrivateRoutes>
        <AllUsers />
      </PrivateRoutes>
    ),
  },
  {
    path: "/dashboard/watchTime",
    element: (
      <PrivateRoutes>
        <WatchTime />
      </PrivateRoutes>
    ),
  },

  {
    path: "/login",
    Component: Login,
  },
  {
    path: "/register",
    Component: Register,
  },
  {
    path: "*",
    Component: NotFound,
  },
]);
