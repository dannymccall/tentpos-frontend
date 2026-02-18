import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { BrowserRouter } from "react-router-dom";
import Router from "./components/Routes/Router.tsx";


const basename = import.meta.env.VITE_BASENAME;

createRoot(document.getElementById("root")!).render(

  <StrictMode>
    <BrowserRouter basename={basename}>
      <Router />
    </BrowserRouter>
  </StrictMode>,
);
