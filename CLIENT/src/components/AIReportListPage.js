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
import NavMenu from "./NavMenu.js";

class AIReportList extends Component {
  callMode; //NewAudit || OpenAudit
  selectRef; //Reference variable
  state = {
    Origin: JSON.parse(localStorage.getItem("user")).userinfo[0].Origin,
    disableDropdown: false, //disable dropdown user login with one VSL
    Description: null, //used for Audit Type filter
    descriptionList: [], //If choose Audit Type "ALL" It is used to store All Audit Type
    VslCode: null
  };

  newVslCodeList = [];
  // editVslCodeList: [];

  constructor() {
    super();

    //get flag ,histID and callMode from URL
    var url = window.location.href;
    var arr = url.split("/");
    this.callMode = arr[3];
    this.selectRef = React.createRef();
  }

  componentWillReceiveProps(props) {
    var dataList = []; //used to store all Audit Types
    dataList.push(props.selectAIDescription.map(item => item.Description));
    this.setState({
      descriptionList: dataList
    });

    var vesselCodeList = [];
    vesselCodeList.push(props.vslCodeList.map(item => item.VslCode));
    this.setState({
      vesselCodeList: vesselCodeList
    });
    setTimeout(() => console.log(this.state.vesselCodeList), 3000);
  }
  componentDidMount() {
    this.newVslCodeList = [...this.props.vslCodeList];

    if (this.callMode == "NewAudit") {
      if (this.state.Origin === "HQ") {
        if (localStorage.getItem("isUsrSelectAll")) {
          //user logged in with HQ origin & selected vslCode 'ALL'
          this.newVslCodeList.shift(); //Remove first element of Array("ALL")
          localStorage.setItem("vesselID", this.newVslCodeList[0].VesselID); //replace vesselID -1 into new vesselID
          this.props.getNewModeDetails(this.props.auditType);
        } else {
          //user logged in with HQ origin & selected only one vslCode in login page
          var data = this.props.vslCodeList.find(item => {
            return item.VesselID == localStorage.getItem("vesselID");
          });
          this.newVslCodeList = [data];
          this.state.disableDropdown = true;
          this.props.getNewModeDetails(this.props.auditType);
        }
      } else if (this.state.Origin === "VSL") {
        //user logged in with VSL origin
        this.state.disableDropdown = true;
        this.props.getNewModeDetails(this.props.auditType);
      }
    } else if (this.callMode == "openAudit") {
      if (this.state.Origin === "HQ") {
        if (localStorage.getItem("isUsrSelectAll")) {
          //user logged in with HQ origin & selected vslCode 'ALL'
          this.props.getAuditDetails(this.props.auditType);
          this.selectRef.current.value = localStorage.getItem("vesselID");
        } else {
          //user logged in with HQ origin & selected only one vslCode in login page
          this.state.disableDropdown = true;
          this.props.getAuditDetails(this.props.auditType);
        }
      } else if (this.state.Origin === "VSL") {
        //user logged in with VSL origin
        this.state.disableDropdown = true;
        this.props.getAuditDetails(this.props.auditType);
      }
      this.selectRef.current.value = localStorage.getItem("vesselID");
    }
  }

  actionTemplate = (rowData, column) => {
    //   if StatusCode is closed , edit button will be removed
    return rowData.StatusCode === "Closed" ? null : (
      <Link
        style={{ color: "blue" }}
        to={`/app/Edit/${rowData.AI_HistID}/${rowData.VesselID}`}
      >
        {/* <button className="btn btn-outline-primary">
        </button> */}
        <span className="fa fa-edit" />
      </Link>
    );
  };

  attachmentTemplate = (rowData, column) => {
    //   if StatusCode is closed , edit button will be removed
    return rowData.HasPhotographAttachments ? (
      <i className="fa fa-paperclip" aria-hidden="true" />
    ) : null;
  };

  onAuditTypeChange(event) {
    if (event.target.value == "All") {
      this.dt.filter(this.state.descriptionList[0], "Description", "in");
      this.setState({
        Description: this.state.descriptionList[0]
      });
    } else {
      this.dt.filter(event.target.value, "Description", "equals");
      this.setState({ Description: event.target.value });
    }
  }
  async onVesselCodeChange(event) {
    if (event.target.value == -1) {
      this.dt.filter(this.state.vesselCodeList[0], "VslCode", "in");
      this.setState({
        Description: this.state.vesselCodeList[0]
      });
    } else {
      let vesselCode = await this.props.vslCodeList.find(
        item => item.VesselID == event.target.value
      );
      this.dt.filter(vesselCode.VslCode, "VslCode", "equals");
      this.setState({ VslCode: vesselCode.VslCode });
    }
  }
  createNewReport = (rowData, column) => {
    return (
      <Link style={{ color: "blue" }} to={`/app/New/-1/-1`}>
        <button
          className="px-2"
          onClick={() => {
            this.props.getNewReport(
              this.props.AI_Details,
              rowData.AI_ListID,
              rowData.Description
            );
          }}
        >
          <span className="fa fa-plus-square"> </span>
        </button>
      </Link>
    );
  };
  render() {
    return (
      <div>
        <NavMenu />
        <div
          className="jumbotron"
          style={{ textAlign: "right", backgroundColor: "rgb(23, 162, 184)" }}
        >
          {this.callMode === "NewAudit" ? (
            <div className="row">
              <div
                className="form-group col-md-4"
                style={{ textAlign: "right" }}
              >
                <label
                  htmlFor="drpVSL1"
                  style={{ display: "inline", color: "white" }}
                >
                  Select Vessel:
                </label>
                <select
                  style={{ display: "inline" }}
                  id="drpVSL1"
                  className="form-control col-md-4 "
                  ref={this.selectRef}
                  disabled={this.state.disableDropdown}
                  // disabled={localStorage.getItem("vesselID") != -1}
                  onChange={
                    e => {
                      localStorage.setItem("vesselID", e.target.value);
                      this.props.getNewModeDetails(this.props.auditType);
                    }

                    // localStorage.setItem("vesselID",e)
                  }
                >
                  {this.newVslCodeList.map(item => {
                    return (
                      <option key={item.VesselID} value={item.VesselID}>
                        {item.VslCode}
                      </option>
                    );
                  })}
                </select>
              </div>
              {/* <div
                className=" col-md-4"
                style={{ color: "white", textAlign: "center" }}
              >
                <h4>{this.props.auditType}</h4>
              </div> */}
              <div className="offset-md-3 col-md-12">
                <div
                  className="col-md-6"
                  style={{ display: "flex", justifyContent: "center" }}
                >
                  <DataTable
                    value={this.props.selectAIDescription}
                    selectionMode="single"
                    scrollHeight="600px"
                    scrollable={true}
                    style={{ textAlign: "center", width: "70% " }}
                    onSelectionChange={e => {
                      this.setState({ selectedData: e.value });
                    }}
                  >
                    {/* <Column field="AI_ListID" header="AI_ListID" /> */}
                    <Column
                      field="Description"
                      // header={`${this.props.auditType}-Audit Type`}
                      header="Audit Type"
                      style={{ width: "80%" }}
                    />
                    <Column
                      header="Action"
                      body={this.createNewReport}
                      style={{ width: "20%" }}
                    />
                  </DataTable>
                </div>
              </div>
            </div>
          ) : (
            <div className="row">
              <div
                className="form-group col-md-3"
                style={{ textAlign: "left" }}
              >
                <label
                  htmlFor="drpVSL2"
                  style={{ display: "inline", color: "white" }}
                >
                  Vessel Filter:
                </label>
                <select
                  disabled={this.state.disableDropdown}
                  style={{ display: "inline" }}
                  id="drpAuditTypes"
                  className="form-control col-md-6 "
                  ref={this.selectRef}
                  onChange={e => {
                    localStorage.setItem("vesselID", e.target.value);
                    // this.props.getAuditDetails(this.props.auditType);
                    this.onVesselCodeChange(e);
                  }}
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
              <div
                className="form-group col-md-6"
                style={{ textAlign: "left" }}
              >
                <label
                  htmlFor="drpVSL2"
                  style={{ display: "inline", color: "white" }}
                >
                  Types of {this.props.auditType}:
                </label>
                <select
                  style={{ display: "inline" }}
                  id="drpAuditTypes"
                  className="form-control col-md-4 "
                  onChange={e => this.onAuditTypeChange(e)}
                >
                  <option value="All">All</option>
                  {this.props.selectAIDescription.map(item => {
                    return (
                      <option
                        title={item.Description}
                        key={item.AI_ListID}
                        value={item.Description}
                      >
                        {item.Description}
                      </option>
                    );
                  })}
                </select>
              </div>

              <DataTable
                // header={
                //   <h5 style={{ color: "black" }}>{this.props.auditType}</h5>
                // }
                ref={el => (this.dt = el)}
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
                  header="VSL Code"
                  style={{ width: "7%" }}
                  sortable={true}
                />
                <Column
                  field="VslName"
                  header="Vessel Name"
                  style={{ width: "12%" }}
                  sortable={true}
                />

                <Column
                  field="Description"
                  // header={`${this.props.auditType}-Audit Type`}
                  header="Audit Type"
                  style={{ width: "20%" }}
                />
                <Column
                  field="StartDate"
                  header="Start Date"
                  style={{ width: "8%" }}
                />
                <Column
                  field="EndDate"
                  header="End Date"
                  style={{ width: "8%" }}
                />
                <Column
                  field="ReportBy"
                  header="Report By"
                  style={{ width: "10%" }}
                />

                <Column
                  field="MasterName"
                  header="Master Name"
                  style={{ width: "10%" }}
                />
                <Column
                  field="SuptName"
                  header="Supt Name"
                  style={{ width: "10%" }}
                />
                <Column
                  field="StatusString"
                  header="Status"
                  style={{ width: "8%" }}
                  sortable={true}
                />
                <Column
                  header="Attach"
                  body={this.attachmentTemplate}
                  style={{ width: "5%" }}
                />

                <Column
                  style={{ width: "5%" }}
                  header="Action"
                  body={this.actionTemplate}
                />
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
