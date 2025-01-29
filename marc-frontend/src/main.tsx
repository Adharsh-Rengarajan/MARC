import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { Provider } from "react-redux";
import store from "../src/redux/store/store.ts";
import { RouterProvider } from "react-router";
import { routes } from "../src/routes/AppRoute.tsx";
import "./i18n";


createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Provider store={store}>
      <RouterProvider router={routes} />
      <App />
    </Provider>
  </StrictMode>
);
