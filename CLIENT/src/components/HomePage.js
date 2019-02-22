import React, { Component } from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import NavMenu from "./NavMenu.js";

import { setAuditTypeToStore } from "../redux/actions/actionCreators.js";
class Home extends Component {
  render() {
    return (
      <div>
        {" "}
        <NavMenu />
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
                  <button type="button" className="btn btn-outline-secondary">
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
                        this.props.setAuditType("All Audits");
                      }}
                    >
                      All Audits
                    </button>
                    <button
                      className="dropdown-item"
                      type="button"
                      onClick={() => {
                        this.props.setAuditType("Vessel Audits");
                      }}
                    >
                      Vessel Audits
                    </button>
                    <button
                      className="dropdown-item"
                      type="button"
                      disabled={this.props.Origin == "VSL"}
                      onClick={() => {
                        this.props.setAuditType("Office Audits");
                      }}
                    >
                      Office Audits
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
                  <button className="btn btn-outline-info " onClick={() => {}}>
                    New Report
                    <span
                      className="fa fa-plus-circle ml-1"
                      aria-hidden="true"
                    />
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
                  <button className="btn btn-outline-info">
                    Existing Report
                    <span className="ml-1 fa fa-edit" />
                  </button>
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
    setAuditType: auditType => dispatch(setAuditTypeToStore(auditType))
  };
};

export default connect(
  mapStateToProps,
  dispatchAction
)(Home);
