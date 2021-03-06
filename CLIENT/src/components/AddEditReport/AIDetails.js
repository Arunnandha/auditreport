import React, { Component } from "react";
import { connect } from "react-redux";
import "../../css/AIDetails.css";
import { EditedAIdetails } from "../../redux/actions/actionCreators.js";
import { Calendar } from "primereact/calendar";
import { Growl } from "primereact/growl";

class AIDetails extends Component {
  state = {
    AI_Details: {
      AIDescription: "",
      AuditInspection_EndDate: null,
      AuditInspection_StartDate: null,
      PortOfAuditInspection: "",
      AuditingCompany: "",
      AuditorName: "",
      ReportDate: null,
      ReportBy: "",
      ReportByRole_Rank: "",
      SuptName: "",
      MasterName: "",
      ClassNo: "",
      Flag: "",
      DelivDate: null,
      ImoNo: "",
      NoOfDefectAdded: 0
    }
  };

  showMultiple = validationdata => {
    this.growl.show(validationdata);
  };

  //capture Redux state's AI details into local state
  //local state used here for manipulation purpose
  componentWillReceiveProps(props) {
    let validationData = [];
    if (props.validationMsg.length > 0) {
      let validationMsgs = props.validationMsg.split("~_");
      if (validationMsgs.length > 0) {
        validationData.push(
          validationMsgs.map(data => {
            return {
              severity: "warn",
              summary: "Required",
              life: 5000,
              detail: data
            };
          })
        );
      }
    }
    this.setState({
      AI_Details: props.AI_Details
    });

    if (validationData.length > 0) {
      //remove the pushed empty object at end of array
      validationData[0].pop();
      this.showMultiple(validationData[0]);
    }
  }

  render() {
    //object destructing
    let AIDescription = this.state.AI_Details.AIDescription;

    return (
      <div className="container-fluid">
        <Growl ref={el => (this.growl = el)} />
        <div className="row AIborderBox">
          {/* Column1 */}
          <div
            className="col-5 inputField py-2 "
            style={{ background: "rgb(112,193,179)" }}
          >
            {/* Name of Audit / Inspection : */}
            <div className="row">
              <div className="col-6 txtAlign">
                <label> Name of Audit / Inspection :</label>
              </div>
              <div className="col-6">
                <textarea id="aiDesc" readOnly value={AIDescription} />
              </div>
            </div>
            {/* AuditInspection StartDate */}
            <div className="row">
              <div className="col-6 txtAlign">
                <label>
                  <span style={{ color: "red" }}> *</span>Audit / Inspection
                  Start Date :
                </label>
              </div>
              <div className="col-6">
                <Calendar
                  dateFormat="dd/M/yy"
                  value={
                    this.state.AI_Details.AuditInspection_StartDate == "" ||
                    this.state.AI_Details.AuditInspection_StartDate == null
                      ? ""
                      : new Date(
                          this.state.AI_Details.AuditInspection_StartDate
                        )
                  }
                  onChange={e => {
                    //  local state update
                    this.setState({
                      AI_Details: {
                        ...this.state.AI_Details,
                        AuditInspection_StartDate: e.target.value.toLocaleDateString()
                      }
                    });
                    // It triggers the "EditedAIdetails" action creator
                    this.props.EditAIdetails({
                      AuditInspection_StartDate: e.target.value.toLocaleDateString()
                    });
                  }}
                  showIcon={true}
                />
              </div>
            </div>
            {/* Audit / Inspection End Date : */}
            <div className="row">
              <div className="col-6 txtAlign">
                <label>
                  <span style={{ color: "red" }}> *</span> Audit / Inspection
                  End Date :
                </label>
              </div>
              <div className="col-6">
                <Calendar
                  dateFormat="dd/M/yy"
                  value={
                    this.state.AI_Details.AuditInspection_EndDate == "" ||
                    this.state.AI_Details.AuditInspection_EndDate == null
                      ? ""
                      : new Date(this.state.AI_Details.AuditInspection_EndDate)
                  }
                  onChange={e => {
                    this.setState({
                      AI_Details: {
                        ...this.state.AI_Details,
                        AuditInspection_EndDate: e.target.value.toLocaleDateString()
                      }
                    });
                    this.props.EditAIdetails({
                      AuditInspection_EndDate: e.target.value.toLocaleDateString()
                    });
                  }}
                  showIcon={true}
                />
              </div>
            </div>
            {/* Place/Port of Audit/Inspctn: */}
            <div className="row">
              <div className="col-6 txtAlign">
                <label>
                  <span style={{ color: "red" }}> *</span> Place/Port of Audit/
                  Inspctn:
                </label>
              </div>
              <div className="col-6">
                <input
                  type="text"
                  defaultValue={this.state.AI_Details.PortOfAuditInspection}
                  onBlur={e =>
                    this.props.EditAIdetails({
                      PortOfAuditInspection: e.target.value
                    })
                  }
                />
              </div>
            </div>
            {/* Auditing Company  */}
            <div className="row">
              <div className="col-6 txtAlign">
                <label> Auditing Company (if any) :</label>
              </div>
              <div className="col-6">
                <input
                  type="text"
                  defaultValue={this.state.AI_Details.AuditingCompany}
                  onBlur={e => {
                    this.props.EditAIdetails({
                      AuditingCompany: e.target.value
                    });
                  }}
                />
              </div>
            </div>
            {/* Auditor Name */}
            <div className="row">
              <div className="col-6 txtAlign">
                <label> Auditor Name (if any) :</label>
              </div>
              <div className="col-6">
                <input
                  type="text"
                  defaultValue={this.state.AI_Details.AuditorName}
                  onBlur={e => {
                    this.props.EditAIdetails({ AuditorName: e.target.value });
                  }}
                />
              </div>
            </div>
          </div>

          {/* ****************************************** */}
          {/* Column2 */}
          {/* Report Date  */}
          <div
            className="col-4 inputField py-2"
            style={{ textAlign: "right", background: "rgb(112,193,179)" }}
          >
            <div className="row">
              <div className="col-6">
                <label>
                  <span style={{ color: "red" }}> *</span>Report Date :
                </label>
              </div>
              <Calendar
                dateFormat="dd/M/yy"
                value={
                  this.state.AI_Details.ReportDate == "" ||
                  this.state.AI_Details.ReportDate == null
                    ? ""
                    : new Date(this.state.AI_Details.ReportDate)
                }
                onChange={e => {
                  this.setState({
                    AI_Details: {
                      ...this.state.AI_Details,
                      ReportDate: e.target.value.toLocaleDateString()
                    }
                  });
                  this.props.EditAIdetails({
                    ReportDate: e.target.value.toLocaleDateString()
                  });
                }}
                showIcon={true}
              />
            </div>
            {/* Report By : */}
            <div className="row">
              <div className="col-6">
                <label>
                  <span style={{ color: "red" }}> *</span> Report By :
                </label>
              </div>
              <input
                type="text"
                defaultValue={this.state.AI_Details.ReportBy}
                onBlur={e => {
                  this.props.EditAIdetails({ ReportBy: e.target.value });
                }}
              />
            </div>
            {/* Report By Role / Rank : */}
            <div className="row">
              <div className="col-6">
                <label> Report By Role / Rank :</label>
              </div>
              <input
                type="text"
                defaultValue={this.state.AI_Details.ReportByRole_Rank}
                onBlur={e => {
                  this.props.EditAIdetails({
                    ReportByRole_Rank: e.target.value
                  });
                }}
              />
            </div>
            {/* SuptName : */}
            <div className="row">
              <div className="col-6">
                <label> SuptName :</label>
              </div>
              <input
                type="text"
                defaultValue={this.state.AI_Details.SuptName}
                onBlur={e => {
                  this.props.EditAIdetails({ SuptName: e.target.value });
                }}
              />
            </div>
            {/* Master Name : */}
            <div className="row">
              <div className="col-6">
                <label> Master Name :</label>
              </div>
              <input
                type="text"
                readOnly
                defaultValue={this.state.AI_Details.MasterName}
                onBlur={e => {
                  this.props.EditAIdetails({ MasterName: e.target.value });
                }}
              />
            </div>
            {/* There is no Observation */}
            <div className="row">
              <div className="col-12">
                <input type="checkbox" style={{ width: "unset" }} />
                <label>There is no Observation</label>
              </div>
            </div>
          </div>

          {/* ****************************************** */}
          {/* Column3 */}

          <div
            className="col-3 vslDetails py-2"
            style={{ textAlign: "right", background: "rgb(243,255,189)" }}
          >
            <div style={{ textAlign: "left", fontWeight: 900 }}>
              <label> Vessel Details</label>
            </div>
            {/* Class Notation : */}
            <div>
              <label> Class Notn:</label>
              <input
                disabled
                type="text"
                defaultValue={this.state.AI_Details.ClassNo}
              />
            </div>
            {/* Flag : */}
            <div>
              <label> Flag :</label>
              <input
                disabled
                type="text"
                defaultValue={this.state.AI_Details.Flag}
              />
            </div>
            {/* Deliv Date : */}
            <div>
              <label> Deliv Date :</label>
              <Calendar
                disabled
                dateFormat="dd/M/yy"
                value={
                  this.state.AI_Details.DelivDate == "" ||
                  this.state.AI_Details.DelivDate == null
                    ? ""
                    : new Date(this.state.AI_Details.DelivDate)
                }
              />
            </div>
            {/* IMO No : */}
            <div>
              <label> IMO No :</label>
              <input
                disabled
                type="text"
                defaultValue={this.state.AI_Details.ImoNo}
              />
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
    HistIdFromState: state.reducer.histID,
    isNewReport: state.reducer.isNewReport,
    validationMsg: state.reducer.validationMsg,
    uid: state.reducer.uid
  };
};

const dispatchAction = dispatch => {
  return {
    EditAIdetails: editedDetails => dispatch(EditedAIdetails(editedDetails))
  };
};

export default connect(
  mapStateToProps,
  dispatchAction
)(AIDetails);
