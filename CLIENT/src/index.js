import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import AddEditReport from "./components/AddEditPage.js";
import { Provider } from "react-redux";
import "../node_modules/bootstrap/dist/css/bootstrap.min.css";
import "primereact/resources/themes/nova-light/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import Home from "./components/HomePage.js";
import { PrivateRoute } from "./router/PrivateRoute.js";
import Login from "./components/LoginPage.js";
import "loaders.css/src/animations/line-scale.scss";
//import { PersistGate } from "redux-persist/integration/react";
import store from "./reduxStore.js";
import { Router, Route, Link, IndexRoute } from "react-router-dom";
import { createBrowserHistory } from "history";
import AIReportList from "./components/AIReportListPage.js";
export const history = createBrowserHistory();

ReactDOM.render(
  // provider makes the redux store available to the connect()
  <Provider store={store}>
    {/* <PersistGate loading={<h1>loading</h1>} persistor={persistor}> */}
    <Router history={history}>
      <div>
        <PrivateRoute exact path="/" component={Home} />
        <Route path="/login" component={Login} />
        <PrivateRoute
          path="/app/:flag/:histID/:VesselID"
          component={AddEditReport}
        />
        <PrivateRoute path="/openAudit" component={AIReportList} />
        <PrivateRoute path="/NewAudit" component={AIReportList} />
      </div>
    </Router>
    {/* </PersistGate> */}
  </Provider>,
  document.getElementById("root")
);
