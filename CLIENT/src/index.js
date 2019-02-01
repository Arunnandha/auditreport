import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./components/App";
import { Provider } from "react-redux";
import myAppStore from "./reduxStore.js";
import "../node_modules/bootstrap/dist/css/bootstrap.min.css";
import "primereact/resources/themes/nova-light/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
// provider makes the redux store available to the connect()
ReactDOM.render(
  <Provider store={myAppStore}>
    <App />
  </Provider>,
  document.getElementById("root")
);
