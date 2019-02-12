import React, { Component } from "react";
import "../css/App.css";
import Header from "./header.js";
import AIDetails from "./AIDetails.js";
import ReportAndObservation from "./ReportAndObservation.js";
import ErrorBoundary from "./HandleErrorComponent.js";
import { Link } from "react-router-dom";
class App extends Component {
  render() {
    return (
      <div className="jumbotron">
        <Link to="/" refresh="true">
      <button
          className="btn btn-danger"
          style={{ position: "absolute", top: "2%", left: "90%" }}
          onClick={() => {
            localStorage.clear();
          }}
        >
          Logout
        </button>
       </Link>
        <h3>New Audit / Inspection Report - ATLANTIC DREAM(d)</h3>
        {/*ErrorBoundary is a React component. It catch JavaScript errors
         anywhere in their child component tree */}
        <ErrorBoundary>
          <Header />

          <AIDetails />

          <ReportAndObservation />
        </ErrorBoundary>
      </div>
    );
  }
}

export default App;
