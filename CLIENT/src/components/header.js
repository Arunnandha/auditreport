import React, { Component } from "react";
import { connect } from "react-redux";
import { getAIdetailsFromDB } from "../redux/actions/services.js";
import "../css/header.css";
import { updateAIdetailsToDB } from "../redux/actions/services";

class Header extends Component {
  histID;
  //get hist id from input text box
  getHistID = data => {
    this.histID = data.target.value;
  };
  render() {
    return (
      <div>
        <div style={{ textAlign: "center" }}>
          <label>Hist ID:</label>
          <input
            className="input-lg"
            type="text"
            placeholder="Enter Hist ID"
            onChange={e => this.getHistID(e)}
          />
          <button
            className="btn btn-outline-secondary ml-2 "
            // It triggers the "getAIdetailsFromD" action creator
            onClick={() => this.props.getAIdetails(this.histID)}
          >
            Retrieve
          </button>
        </div>
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
              <button
                className="btn btn-outline-success m-2"
                // It triggers the "updateAIdetailsToDB" action creator
                onClick={() =>
                  this.props.updateAIdetails(
                    this.props.AI_Details,
                    this.props.HistId
                  )
                }
              >
                Save and Exit
              </button>
              <button className="btn btn-outline-success m-2">Finalize</button>
            </div>
            <div className="col-2">
              <button className="btn btn-outline-info m-2">log</button>
              <button className="btn btn-outline-danger m-2">Cancel</button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    AI_Details: state.AIdetails,
    HistId: state.histID
  };
};

const dispatchAction = dispatch => {
  return {
    getAIdetails: histID => dispatch(getAIdetailsFromDB(histID)),
    updateAIdetails: (updatedDetails, HistId) =>
      dispatch(updateAIdetailsToDB(updatedDetails, HistId))
  };
};
export default connect(
  mapStateToProps,
  dispatchAction
)(Header);
