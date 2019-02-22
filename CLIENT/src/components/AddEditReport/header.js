import React, { Component } from "react";
import "../../css/header.css";
import { Link } from "react-router-dom";
import { validatingAIDetails } from "../../redux/actions/actionCreators.js";
import { getAIReportLog } from "../../redux/actions/services.js";
import { connect } from "react-redux";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Dialog } from "primereact/dialog";

class Header extends Component {
  state = { callMode: "", visible: false };
  componentDidMount() {
    var url = window.location.href;
    var arr = url.split("/");
    if (arr[4] == "Edit") {
      this.setState({ callMode: "openAudit" });
    } else this.setState({ callMode: "NewAudit" });
  }

  renderlogDetails() {
    return (
      <div>
        <DataTable
          value={this.props.logDetails}
          selectionMode="single"
          scrollHeight="550px"
          scrollable={true}
          style={{ textAlign: "left" }}
        >
          <Column field="LogDate" header="Log Date" style={{ width: "20%" }} />
          <Column
            field="userName"
            header="Name-Rank"
            style={{ width: "20%" }}
          />
          <Column field="Activity" header="Activity" style={{ width: "25%" }} />
          <Column field="Remarks" header="Remarks" style={{ width: "35%" }} />
        </DataTable>
        <div className="text-right">
          <button
            className="btn btn-primary m-2"
            onClick={() => {
              this.setState({ visible: false });
            }}
          >
            Close
          </button>
        </div>
      </div>
    );
  }

  getReportLog() {
    const { AI_ListID, AI_ListVslID } = this.props;
    this.props.getCurrentLogDetails(
      AI_ListID,
      AI_ListVslID,
      localStorage.getItem("vesselID")
    );
    this.setState({ visible: true });
  }

  render() {
    return (
      <div>
        <div className="container-fluid my-2 background">
          <div className="row borderBox">
            <div className="col-3 mt-3" style={{ color: "white" }}>
              <span style={{ fontWeight: 600 }}> AI Ref Code :</span>
              {this.props.AI_Details.AIRefCode}
            </div>
            <div className="col-3 mt-3" style={{ color: "white" }}>
              <span style={{ fontWeight: 600 }}>Report Status:</span>
              {this.props.AI_Details.StatusString}
            </div>
            <div className="col-4">
              <button
                className="btn btn-success m-2"
                // It triggers the "updateAIdetailsToDB" action creator
                onClick={() => {
                  this.props.validatingAIDetails(
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

              <button className="btn btn-success m-2">Finalize</button>
            </div>
            <div className="col-2">
              <button
                className="btn btn-info m-2"
                onClick={() => this.getReportLog()}
              >
                log
              </button>
              <Link to={`/${this.state.callMode}`}>
                <button className="btn btn-secondary m-2">Cancel</button>
              </Link>
            </div>
          </div>
        </div>
        <Dialog
          header="AI Log"
          visible={this.state.visible}
          width="600px"
          modal={true}
          onHide={() => this.setState({ visible: false })}
        >
          {this.renderlogDetails()}
        </Dialog>
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
    logDetails: state.log.logDetails,
    AI_ListVslID: state.reducer.AIdetails.AI_List_VslID
  };
};

const dispatchAction = dispatch => {
  return {
    validatingAIDetails: (
      updatedDetails,
      HistId,
      Origin,
      AI_ListID,
      flag,
      vesselID
    ) =>
      dispatch(
        validatingAIDetails(
          updatedDetails,
          HistId,
          Origin,
          AI_ListID,
          flag,
          vesselID
        )
      ),
    getCurrentLogDetails: (AI_ListID, AI_ListVslID, vesselID) =>
      dispatch(getAIReportLog(AI_ListID, AI_ListVslID, vesselID))
  };
};
export default connect(
  mapStateToProps,
  dispatchAction
)(Header);
