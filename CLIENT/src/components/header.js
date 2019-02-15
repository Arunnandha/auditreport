import React, { Component } from "react";
import "../css/header.css";
import { Link } from "react-router-dom";
import { updateAIdetailsToDB } from "../redux/actions/services";
import { connect } from "react-redux";

class Header extends Component {
  state = { callMode: "" };
  componentDidMount() {
    var url = window.location.href;
    var arr = url.split("/");
    if (arr[4] == "Edit") {
      this.setState({ callMode: "openAudit" });
    } else this.setState({ callMode: "NewAudit" });
  }
  render() {
    return (
      <div>
        <div className="container-fluid my-2 background">
          <div style={{ border: "1px solid" }} className="row">
            <div className="col-3 mt-3">
              <span style={{ fontWeight: 600 }}> AI Ref Code :</span>
              {this.props.AI_Details.AIRefCode}
            </div>
            <div className="col-3 mt-3">
              <span style={{ fontWeight: 600 }}>Report Status:</span>
              {this.props.AI_Details.StatusString}
            </div>
            <div className="col-4">
              <Link to="/" refresh="true">
                <button
                  className="btn btn-outline-success m-2"
                  // It triggers the "updateAIdetailsToDB" action creator
                  onClick={() => {
                    this.props.updateAIdetails(
                      this.props.AI_Details,
                      this.props.HistId,
                      this.props.Origin,
                      this.props.AI_ListID,
                      this.flag,
                      this.props.vesselID
                    );
                  }}
                >
                  Save and Exit
                </button>
              </Link>

              <button className="btn btn-outline-success m-2">Finalize</button>
            </div>
            <div className="col-2">
              <button className="btn btn-outline-info m-2">log</button>
              <Link to={`/${this.state.callMode}`}>
                <button className="btn btn-outline-secondary m-2">
                  Cancel
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    AI_Details: state.reducer.AIdetails,
    HistId: state.reducer.histID,
    Origin: state.loginReducer.userDetails.Origin,
    AI_ListID: state.reducer.AIdetails.AI_ListID,
    vesselID: state.loginReducer.vesselID
  };
};

const dispatchAction = dispatch => {
  return {
    updateAIdetails: (
      updatedDetails,
      HistId,
      Origin,
      AI_ListID,
      flag,
      vesselID
    ) =>
      dispatch(
        updateAIdetailsToDB(
          updatedDetails,
          HistId,
          Origin,
          AI_ListID,
          flag,
          vesselID
        )
      )
  };
};
export default connect(
  mapStateToProps,
  dispatchAction
)(Header);
