import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import PathTest from "./pathtest/PathTest.tsx";
import PathTest2 from "./PathTest2.tsx";
import LightPathTest from "./LightPathTest.tsx";

gsap.registerPlugin(useGSAP, ScrollTrigger);

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
  },
  {
    path: "/path-test",
    element: <PathTest />,
  },
  {
    path: "/path-test2",
    element: <PathTest2 />,
  },
  {
    path: "/path-test3",
    element: <LightPathTest />,
  },
]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
);
