import ReactDOM from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import router from "./router/root";
import "./index.css";
import App from "./App";
import { AuthProvider } from "./contexts/Authcontext"

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <AuthProvider>
    <RouterProvider router={router} />
  </AuthProvider>
  
);
