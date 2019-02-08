import React, { Component } from "react";
import "../css/App.css";
import { Router, Route } from "react-router-dom";

import Login from "./login.js";
import AuditTypes from "./AuditTypes";
import { PrivateRoute } from "../router/PrivateRoute";
import { createBrowserHistory } from "history";

export const history = createBrowserHistory();
class App extends Component {
  render() {
    return (
      <div style={{ height: "100%" }}>
        <Router history={history}>
          <div>
            <PrivateRoute exact path="/" component={AuditTypes} />
            <Route path="/login" component={Login} />
          </div>
        </Router>
      </div>
    );
  }
}

export default App;
