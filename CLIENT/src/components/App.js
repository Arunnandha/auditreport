import React, { Component } from "react";
import "../css/App.css";
import Header from "./Header.js";
import AIDetails from "./AIDetails.js";
import ReportAndObservation from "./ReportAndObservation.js";
import ErrorBoundary from "./HandleErrorComponent.js";
class App extends Component {
  render() {
    return (
      <div className="jumbotron">
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
