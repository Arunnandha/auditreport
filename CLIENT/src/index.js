import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./components/EditPage.js";
import { Provider } from "react-redux";
import "../node_modules/bootstrap/dist/css/bootstrap.min.css";
import "primereact/resources/themes/nova-light/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import AuditTypes from "./components/AuditTypes";
import { PrivateRoute } from "./router/PrivateRoute";
import Login from "./components/login";
import "loaders.css/src/animations/line-scale.scss";
import { PersistGate } from "redux-persist/integration/react";
import { store, persistor } from "./reduxStore";
import { Router, Route, Link, IndexRoute } from "react-router-dom";
import { createBrowserHistory } from "history";
import openAuditPage from "./components/openAuditPage";
export const history = createBrowserHistory();

ReactDOM.render(
  // provider makes the redux store available to the connect()
  <Provider store={store}>
    <PersistGate loading={<h1>loading</h1>} persistor={persistor}>
      <Router history={history}>
        <div>
          <PrivateRoute exact path="/" component={AuditTypes} />
          <Route path="/login" component={Login} />
          <PrivateRoute path="/app/:flag/:histID" component={App} />
          <PrivateRoute path="/openAudit" component={openAuditPage} />
          <PrivateRoute path="/NewAudit" component={openAuditPage} />
        </div>
      </Router>
    </PersistGate>
  </Provider>,
  document.getElementById("root")
);
