import React, { Component } from "react";
import "../css/AddEditReport.css";
import Header from "./AddEditReport/header.js";
import AIDetails from "./AddEditReport/AIDetails.js";
import ReportAndObservation from "./AddEditReport/ReportAndObservation.js";
import ErrorBoundary from "./HandleError.js";
import { connect } from "react-redux";
import { getAIdetailsFromDB } from "../redux/actions/services.js";
import NavMenu from "./NavMenu.js";

class AddEditReport extends Component {
  histID;
  flag;
  vesselID;
  constructor() {
    super();
    //get flag and histID from URL
    var url = window.location.href;
    var arr = url.split("/");
    this.histID = arr[5];
    this.vesselID = arr[6];
    this.flag = arr[4].toUpperCase();
  }
  componentDidMount() {
    if (this.histID === -1 || this.flag === "NEW") {
      //if new edit
    } else {
      localStorage.setItem("vesselID", this.vesselID);
      this.props.getAIdetails(this.histID);
      //set isNewReport: false
    }
  }
  render() {
    return (
      <div>
        <NavMenu />

        <div
          className="jumbotron"
          style={{ backgroundColor: "rgb(23, 162, 184)" }}
        >
          {/* <h5>
            New Audit / Inspection Report-
            {JSON.parse(localStorage.getItem("user")).userinfo[0].VslName}
          </h5> */}
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
)(AddEditReport);
