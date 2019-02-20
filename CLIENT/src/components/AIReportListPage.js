import React, { Component } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import {
  getNewReportFromDB,
  getAuditDetailsFromDB,
  getNewModeDetailsFromDB
} from "../redux/actions/services.js";
import Menu from "./NavMenu.js";

class AIReportList extends Component {
  callMode;
  selectRef;
  constructor() {
    super();
    //get flag and histID from URL
    var url = window.location.href;
    var arr = url.split("/");
    this.callMode = arr[3];
    this.selectRef = React.createRef();
  }
  componentDidMount() {
    //get these details Description, AI_HistID, StatusCode, StatusString
    if (this.callMode == "openAudit") {
      this.props.getAuditDetails(this.props.auditType);
      this.selectRef.current.value = localStorage.getItem("vesselID");
    } else if (this.props.vslCodeList[0].VesselID === -1) {
      localStorage.setItem("vesselID", this.props.vslCodeList[1].VesselID);
      this.props.getNewModeDetails(this.props.auditType);
      this.selectRef.current.value = localStorage.getItem("vesselID");
    } else {
      this.props.getNewModeDetails(this.props.auditType);
    }
  }
  actionTemplate = (rowData, column) => {
    //   if StatusCode is closed , edit button will be removed
    return rowData.StatusCode === "Closed" ? null : (
      <Link
        style={{ color: "white" }}
        to={`/app/Edit/${rowData.AI_HistID}/${rowData.VesselID}`}
      >
        <button className="btn btn-primary" onClick={() => {}}>
          Edit
        </button>
      </Link>
    );
  };
  attachmentTemplate = (rowData, column) => {
    //   if StatusCode is closed , edit button will be removed
    return rowData.HasPhotographAttachments ? (
      <i className="fa fa-paperclip" aria-hidden="true" />
    ) : null;
  };
  createNewReport = (rowData, column) => {
    return (
      <Link style={{ color: "white" }} to={`/app/New/-1/-1`}>
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
            <div>
              <div className="form-group col-4">
                <label for="drpVSL1" style={{ display: "inline" }}>
                  {" "}
                  VSL Code Filter:{" "}
                </label>
                <select
                  style={{ display: "inline" }}
                  id="drpVSL1"
                  className="form-control col-4 "
                  ref={this.selectRef}
                  // disabled={localStorage.getItem("vesselID") != -1}
                  onChange={
                    e => {
                      localStorage.setItem("vesselID", e.target.value);
                      this.props.getNewModeDetails(this.props.auditType);
                    }

                    // localStorage.setItem("vesselID",e)
                  }
                >
                  {this.props.vslCodeList.map(item => {
                    return (
                      <option key={item.VesselID} value={item.VesselID}>
                        {item.VslCode}
                      </option>
                    );
                  })}
                </select>
              </div>
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
            </div>
          ) : (
            <div className="row">
              <div className="form-group col-4">
                <label for="drpVSL2" style={{ display: "inline" }}>
                  {" "}
                  VSL Code Filter:{" "}
                </label>
                <select
                  style={{ display: "inline" }}
                  id="drpVSL2"
                  className="form-control col-4 "
                  ref={this.selectRef}
                  // disabled={localStorage.getItem("vesselID") != -1}
                  onChange={
                    e => {
                      localStorage.setItem("vesselID", e.target.value);
                      this.props.getAuditDetails(this.props.auditType);
                    }

                    // localStorage.setItem("vesselID",e)
                  }
                >
                  {this.props.vslCodeList.map(item => {
                    return (
                      <option key={item.VesselID} value={item.VesselID}>
                        {item.VslCode}
                      </option>
                    );
                  })}
                </select>
              </div>
              <div className="form-group col-4">
                <label for="drpAuditTypes" style={{ display: "inline" }}>
                  Audit Type Filter:
                </label>
                <select
                  style={{ display: "inline" }}
                  id="drpAuditTypes"
                  className="form-control col-4 "
                  ref={this.selectRef}
                  // disabled={localStorage.getItem("vesselID") != -1}
                  onChange={
                    e => {
                      localStorage.setItem("vesselID", e.target.value);
                      this.props.getNewModeDetails(this.props.auditType);
                    }

                    // localStorage.setItem("vesselID",e)
                  }
                >
                  {this.props.vslCodeList.map(item => {
                    return (
                      <option key={item.VesselID} value={item.VesselID}>
                        {item.VslCode}
                      </option>
                    );
                  })}
                </select>
              </div>

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
                <Column
                  field="VslCode"
                  header="VslCode"
                  style={{ width: "10%" }}
                  sortable={true}
                />
                <Column
                  field="VslName"
                  header="VslName"
                  style={{ width: "10%" }}
                  sortable={true}
                />

                <Column
                  field="Description"
                  header="Description"
                  style={{ width: "25%" }}
                />
                <Column
                  field="StartDate"
                  header="Start Date"
                  style={{ width: "10%" }}
                />
                <Column
                  field="EndDate"
                  header="End Date"
                  style={{ width: "10%" }}
                />
                <Column
                  field="ReportBy"
                  header="ReportBy"
                  style={{ width: "10%" }}
                />
                <Column
                  field="StatusString"
                  header="Status"
                  style={{ width: "10%" }}
                  sortable={true}
                />
                <Column
                  header="Attach"
                  body={this.attachmentTemplate}
                  style={{ width: "5%" }}
                />

                <Column header="Action" body={this.actionTemplate} />
              </DataTable>
            </div>
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
    AI_Details: state.reducer.AIdetails,
    vslCodeList: state.loginReducer.vslCodeList
  };
};

const dispatchAction = dispatch => {
  return {
    getAuditDetails: auditType => dispatch(getAuditDetailsFromDB(auditType)),
    getNewReport: (newAIdetails, AI_ListID, AIDescription) =>
      dispatch(getNewReportFromDB(newAIdetails, AI_ListID, AIDescription)),
    getNewModeDetails: auditType => dispatch(getNewModeDetailsFromDB(auditType))
  };
};

export default connect(
  mapStateToProps,
  dispatchAction
)(AIReportList);
