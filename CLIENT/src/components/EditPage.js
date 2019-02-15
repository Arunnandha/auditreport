import React, { Component } from "react";
import "../css/App.css";
import Header from "./header.js";
import AIDetails from "./AIDetails.js";
import ReportAndObservation from "./ReportAndObservation.js";
import ErrorBoundary from "./HandleErrorComponent.js";
import { connect } from "react-redux";
import { getAIdetailsFromDB } from "../redux/actions/services.js";
import Menu from "./Menu";

class App extends Component {
  histID;
  flag;
  constructor() {
    super();
    //get flag and histID from URL
    var url = window.location.href;
    var arr = url.split("/");
    this.histID = arr[5];
    this.flag = arr[4].toUpperCase();
  }
  componentDidMount() {
    if (this.histID === -1 || this.flag === "NEW") {
    } else {
      this.props.getAIdetails(this.histID);
      //set isNewReport: false
    }
  }
  render() {
    return (
      <div>
        <Menu />

        <div className="jumbotron">
          <h3>
            New Audit / Inspection Report-
            {JSON.parse(localStorage.getItem("user")).userinfo[0].VslName}
          </h3>
          {/*ErrorBoundary is a React component. It catch JavaScript errors
         anywhere in their child component tree */}
          <ErrorBoundary>
            <Header />
          </ErrorBoundary>
          <ErrorBoundary>
            <AIDetails />
          </ErrorBoundary>
          <ErrorBoundary>
            <ReportAndObservation />
          </ErrorBoundary>
        </div>
      </div>
    );
  }
}

const dispatchAction = dispatch => {
  return {
    getAIdetails: histID => dispatch(getAIdetailsFromDB(histID))
  };
};
export default connect(
  null,
  dispatchAction
)(App);
