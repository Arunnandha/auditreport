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
import AuditTypes from "./components/AuditTypes";
import { PrivateRoute } from "./router/PrivateRoute";
import Login from "./components/login";

import { Router, Route, Link, IndexRoute } from "react-router-dom";
import { createBrowserHistory } from "history";

export const history = createBrowserHistory();
// provider makes the redux store available to the connect()
ReactDOM.render(
  <Provider store={myAppStore}>
    <Router history={history}>
      <div>
        <PrivateRoute exact path="/" component={AuditTypes} />
        <Route path="/login" component={Login} />
        <PrivateRoute path="/app/:flag/:histID" component={App} />
      </div>
    </Router>
  </Provider>,
  document.getElementById("root")
);
