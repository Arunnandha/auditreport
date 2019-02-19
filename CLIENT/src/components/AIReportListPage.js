import React, { Component } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import {
  getNewReportFromDB,
  getAuditDetailsFromDB
} from "../redux/actions/services.js";
import Menu from "./NavMenu.js";

class AIReportList extends Component {
  callMode;
  constructor() {
    super();
    //get flag and histID from URL
    var url = window.location.href;
    var arr = url.split("/");
    this.callMode = arr[3];
  }
  componentDidMount() {
    //get these details Description, AI_HistID, StatusCode, StatusString
    if (this.callMode == "openAudit") {
      this.props.getAuditDetails(this.props.auditType);
    }
  }
  actionTemplate = (rowData, column) => {
    //   if StatusCode is closed , edit button will be removed
    return rowData.StatusCode === "Closed" ? null : (
      <Link style={{ color: "white" }} to={`/app/Edit/${rowData.AI_HistID}`}>
        <button
          className="btn btn-primary"
          onClick={() => {
            console.log(rowData, column);
          }}
        >
          Edit
        </button>
      </Link>
    );
  };
  createNewReport = (rowData, column) => {
    return (
      <Link style={{ color: "white" }} to={`/app/New/-1`}>
        <button
          className="btn btn-info "
          onClick={() => {
            this.props.getNewReport(
              this.props.AI_Details,
              rowData.AI_ListID,
              rowData.Description
            );
          }}
        >
          Create New Report
        </button>
      </Link>
    );
  };
  render() {
    return (
      <div>
        <Menu />
        <div className="jumbotron">
          {this.callMode === "NewAudit" ? (
            <DataTable
              header={
                <span style={{ color: "blue" }}>{this.props.auditType}</span>
              }
              value={this.props.selectAIDescription}
              selectionMode="single"
              scrollHeight="600px"
              scrollable={true}
              style={{ textAlign: "center" }}
              onSelectionChange={e => {
                this.setState({ selectedData: e.value });
              }}
            >
              {/* <Column field="AI_ListID" header="AI_ListID" /> */}
              <Column field="Description" header="Description" />
              <Column body={this.createNewReport} />
            </DataTable>
          ) : (
            <DataTable
              header={
                <span style={{ color: "blue" }}>{this.props.auditType}</span>
              }
              value={this.props.AI_AuditDetails}
              selectionMode="single"
              scrollHeight="600px"
              scrollable={true}
              style={{ textAlign: "center" }}
              onSelectionChange={e => {
                this.setState({ selectedData: e.value });
              }}
            >
              {/* <Column field="AI_HistID" header="AI_HistID" /> */}
              <Column field="StatusCode" header="StatusCode" />
              <Column field="Description" header="Description" />
              <Column field="SubDescription" header="SubDescription" />
              <Column body={this.actionTemplate} />
            </DataTable>
          )}
        </div>
      </div>
    );
  }
}
const mapStateToProps = state => {
  return {
    AI_AuditDetails: state.reducer.AI_AuditDetails,
    HistId: state.reducer.histID,
    auditType: state.reducer.auditType,
    selectAIDescription: state.reducer.selectAIDescription,
    AI_Details: state.reducer.AIdetails
  };
};

const dispatchAction = dispatch => {
  return {
    getAuditDetails: auditType => dispatch(getAuditDetailsFromDB(auditType)),
    getNewReport: (newAIdetails, AI_ListID, AIDescription) =>
      dispatch(getNewReportFromDB(newAIdetails, AI_ListID, AIDescription))
  };
};

export default connect(
  mapStateToProps,
  dispatchAction
)(AIReportList);
