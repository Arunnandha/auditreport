import React, { Component } from "react";
import { Dialog } from "primereact/dialog";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { getAduitDetailsFromDB } from "../redux/actions/services.js";
class auditTypes extends Component {
  // get vessel code
  //create action for get Audit details for correspng vsl code
  //set flag new/edit
  state = {
    visible: false,
    type: "All"
  };

  actionTemplate = (rowData, column) => {
    return rowData.Status === "closed" ? null : (
      <Link style={{ color: "white" }} to={`/app/Edit/${rowData.AI_HistID}`}>
        <button
          className="btn btn-primary"
          onClick={() => {
            console.log(rowData, column);
          }}
        >
          click
        </button>
      </Link>
    );
  };
  openAudit() {
    return (
      <DataTable
        value={this.props.AI_AuditDetails}
        selectionMode="single"
        scrollHeight="200px"
        scrollable={true}
        onSelectionChange={e => {
          this.setState({ selectedData: e.value });
        }}
      >
        <Column field="AI_HistID" header="AI_HistID" />
        <Column field="StatusCode" header="StatusCode" />
        <Column body={this.actionTemplate} />
      </DataTable>
    );
  }
  render() {
    return (
      <div
        className="containers container-fluid "
        style={{ backgroundColor: "aquamarine" }}
      >
        <div
          className="jumbotron"
          style={{ textAlign: "center", width: "36%" }}
        >
          <div className="row">
            <div
              className="col-6"
              style={{
                textAlign: "right"
              }}
            >
              <label
                style={{
                  fontSize: "16px",
                  marginTop: ".5rem"
                }}
              >
                Audit Types:
              </label>
            </div>
            <div
              className="col-6"
              style={{
                textAlign: "left"
              }}
            >
              <div className="dropdown btn-group dropright mb-5">
                <button type="button" className="btn btn-secondary">
                  {this.state.type}
                </button>
                <button
                  type="button"
                  className="btn btn-secondary dropdown-toggle dropdown-toggle-split"
                  data-toggle="dropdown"
                  aria-haspopup="true"
                  aria-expanded="false"
                />
                <div className="dropdown-menu" aria-labelledby="dropdownMenu2">
                  <button
                    className="dropdown-item"
                    type="button"
                    onClick={() => {
                      this.setState({ type: "All" });
                    }}
                  >
                    All
                  </button>
                  <button
                    className="dropdown-item"
                    type="button"
                    onClick={() => {
                      this.setState({ type: "Vessel Audit" });
                    }}
                  >
                    Vessel Audit
                  </button>
                  <button
                    className="dropdown-item"
                    type="button"
                    onClick={() => {
                      this.setState({ type: "Office Audit" });
                    }}
                  >
                    Office Audit
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="row">
            <div
              className="col-6"
              style={{
                textAlign: "right"
              }}
            >
              <Link style={{ color: "white" }} to={`/app/new/-1`}>
                <button className="btn btn-info ">New Audit</button>
              </Link>
            </div>

            <div
              className="col-6"
              style={{
                textAlign: "left"
              }}
            >
              <button
                className="btn btn-info"
                onClick={() => {
                  this.setState({ visible: true });
                  this.props.getAduitDetails(905);
                }}
              >
                Open Audit
              </button>
            </div>
          </div>
          <Dialog
            header={<span style={{ color: "blue" }}>Open Audit</span>}
            visible={this.state.visible}
            width="500px"
            modal={true}
            onHide={() => {
              this.setState({ visible: false });
            }}
          >
            {this.openAudit()}
          </Dialog>
        </div>
      </div>
    );
  }
}
const mapStateToProps = state => {
  console.log("state from AIdetails comp:", state);
  return {
    AI_AuditDetails: state.reducer.AI_AuditDetails
  };
};

const dispatchAction = dispatch => {
  return {
    getAduitDetails: vesselID => dispatch(getAduitDetailsFromDB(vesselID))
  };
};

export default connect(
  mapStateToProps,
  dispatchAction
)(auditTypes);
