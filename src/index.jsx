import React from "react";
import ReactDOM from "react-dom/client";
import "./index.scss";
import App from "./App";
import "./i18n";
import reportWebVitals from "./reportWebVitals";
import { Provider } from "react-redux";
import store from "./redux/store";
import axios from "axios";

axios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error?.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("login");
      localStorage.removeItem("authenticated");
      localStorage.removeItem("UserData");
      localStorage.removeItem("role_name");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

const Root = () => {
  return (
    <Provider store={store}>
      <div className="App">
        <App />
      </div>
    </Provider>
  );
};

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<Root />);

reportWebVitals();
