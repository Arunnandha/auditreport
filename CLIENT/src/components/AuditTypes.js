import React, { Component } from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import Menu from "./Menu";

import { getNewModeDetailsFromDB } from "../redux/actions/services.js";
import { setAuditTypeToStore } from "../redux/actions/actionCreators.js";
class auditTypes extends Component {
  render() {
    return (
      <div>
        {" "}
        <Menu />
        <div
          className="containers container-fluid "
          style={{ backgroundColor: "#17a2b8" }}
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
                    {this.props.auditType}
                  </button>
                  <button
                    type="button"
                    className="btn btn-secondary dropdown-toggle dropdown-toggle-split"
                    data-toggle="dropdown"
                    aria-haspopup="true"
                    aria-expanded="false"
                  />
                  <div
                    className="dropdown-menu"
                    aria-labelledby="dropdownMenu2"
                  >
                    <button
                      className="dropdown-item"
                      type="button"
                      disabled={this.props.Origin == "VSL"}
                      onClick={() => {
                        this.props.setAuditType("All");
                      }}
                    >
                      All
                    </button>
                    <button
                      className="dropdown-item"
                      type="button"
                      onClick={() => {
                        this.props.setAuditType("Vessel Audit");
                      }}
                    >
                      Vessel Audit
                    </button>
                    <button
                      className="dropdown-item"
                      type="button"
                      disabled={this.props.Origin == "VSL"}
                      onClick={() => {
                        this.props.setAuditType("Office Audit");
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
                <Link style={{ color: "white" }} to={`/NewAudit`}>
                  <button
                    className="btn btn-info "
                    onClick={() => {
                      this.props.getNewModeDetails(this.props.auditType);
                    }}
                  >
                    New Audit
                  </button>
                </Link>
              </div>

              <div
                className="col-6"
                style={{
                  textAlign: "left"
                }}
              >
                <Link to="/openAudit">
                  <button className="btn btn-info">Open Audit</button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
const mapStateToProps = state => {
  console.log("state from AIdetails comp:", state);
  return {
    AI_AuditDetails: state.reducer.AI_AuditDetails,
    AI_Details: state.reducer.AIdetails,
    HistId: state.reducer.histID,
    Origin: state.loginReducer.userDetails.Origin,
    auditType: state.reducer.auditType
  };
};

const dispatchAction = dispatch => {
  return {
    getNewModeDetails: auditType =>
      dispatch(getNewModeDetailsFromDB(auditType)),
    setAuditType: auditType => dispatch(setAuditTypeToStore(auditType))
  };
};

export default connect(
  mapStateToProps,
  dispatchAction
)(auditTypes);
