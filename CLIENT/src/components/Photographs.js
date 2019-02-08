import React, { Component } from "react";
import { DataView } from "primereact/dataview";
import { Panel } from "primereact/panel";
import { Dialog } from "primereact/dialog";
import {
  handleUpload,
  deleteAttachment,
  handleEditUpload
} from "../redux/actions/services";
import { connect } from "react-redux";

class PhotoGraphs extends Component {
  constructor() {
    super();
    this.state = {
      selectedFile: null,
      activeAiAttachmentId: -1,
      description: "",
      selectedFileName: "",
      callMode: "",
      selectedImage: "",
      visible: false,
      viewDialog: false,
      delDialogvisible: false,
      enableAddBtn: false
    };
  }

  componentDidMount() {
    this.enableDisabelAddBtn();
  }

  componentWillReceiveProps(props) {
    this.setState({ blobs: props.blobContent });
    this.enableDisabelAddBtn();
  }

  itemTemplate = (blobs, layout) => {
    if (layout === "grid") return this.renderGridItem(blobs);
  };

  renderGridItem(blobs) {
    if (blobs.BlobContents === null) return null;

    return (
      <div style={{ padding: "2px" }} className="p-col-12 p-md-3">
        <div style={{ padding: "2px" }} className="p-col-12">
          <Panel header={blobs.FileName} style={{ textAlign: "center" }}>
            <img
              style={{ width: "240px", height: "200px" }}
              src={"data:image/jpg;base64," + blobs.BlobContents}
            />
            <hr className="ui-widget-content" style={{ borderTop: 0 }} />
            {/*click to open delete dialog box */}
            <button
              title="Delete"
              className="btn btn-danger m-2"
              onClick={e => {
                this.setState({
                  delDialogvisible: true,
                  activeAiAttachmentId: blobs.AI_Hist_PhotographAttachmentsID
                });
              }}
            >
              <i className="fas fa-trash-alt" />
            </button>
            {/* click to open edit dialog box */}
            <button
              title="Edit"
              className="btn btn-info m-2"
              onClick={e => {
                this.setState({
                  visible: true,
                  callMode: "EDIT",
                  activeAiAttachmentId: blobs.AI_Hist_PhotographAttachmentsID,
                  description: blobs.Description,
                  selectedFileName: blobs.FileName
                });
              }}
            >
              <i className="far fa-edit" />
            </button>
            {/*click to open view dialog box */}
            <button
              title="View"
              className="btn btn-info m-2"
              onClick={e => {
                this.setState({
                  selectedImage: blobs.BlobContents,
                  selectedFileName: blobs.FileName,
                  viewDialog: true
                });
              }}
            >
              <i className="fa fa-eye" aria-hidden="true" />
            </button>
          </Panel>
        </div>
      </div>
    );
  }

  renderHeader() {
    return (
      <div className="row">
        <div className="col" style={{ textAlign: "left" }}>
          <p>
            <span>Total No.of Attachments:0</span>
            <span style={{ paddingLeft: "5px" }}>
              ( Max size=10 MB. No of Photographs allowed:10 )
            </span>
          </p>
        </div>
        <div
          className="col"
          style={{ marginLeft: "5px" }}
          style={{ textAlign: "left" }}
        >
          {/* click to open add Attachments dialog box */}
          <button
            className="btn btn-info btn-sm"
            disabled={this.state.enableAddBtn}
            onClick={() => {
              this.setState({ visible: true, callMode: "NEW" });
            }}
          >
            Add New Photograph
          </button>
        </div>
      </div>
    );
  }

  renderAddDialogContent() {
    let editComponent = "";
    if (this.state.callMode === "EDIT") {
      editComponent = React.createElement(
        "a",
        { href: "#" },
        this.state.selectedFileName
      );
    }
    return (
      <div
        className="form-group"
        style={{ fontSize: "16px", textAlign: "left", padding: "5px" }}
      >
        <textarea
          className="form-control"
          rows="5"
          value={this.state.description}
          onChange={e => this.setState({ description: e.target.value })}
        />
        <div style={{ textAlign: "left", margin: "2px" }} className="p-col-12">
          <input
            type="file"
            name="myFile"
            ref={ref => (this.fileInput = ref)}
            accept="image/*"
            onChange={this.handleUploadFile}
          />
        </div>
        {editComponent}
        <div style={{ textAlign: "right" }} className="p-col-12">
          <button
            className="btn btn-outline-danger btn-sm m-2"
            onClick={() => {
              this.setState({ visible: false });
              this.clearDialog();
            }}
          >
            Cancel
          </button>
          <button
            className="btn btn-outline-success btn-sm m-2"
            onClick={this.submitPhotoGraph}
          >
            Submit
          </button>
        </div>
      </div>
    );
  }
  renderDeleteDialogContent() {
    return (
      <div
        className="form-group"
        style={{ fontSize: "16px", textAlign: "left" }}
      >
        <p>Are you sure want to delete?</p>
        <div style={{ textAlign: "right" }} className="p-col-12">
          <button
            className="btn btn-outline-info btn-sm m-2"
            onClick={() => this.setState({ delDialogvisible: false })}
          >
            Cancel
          </button>
          <button
            className="btn btn-outline-info btn-sm m-2"
            onClick={() => {
              this.props.delBlob(this.state.activeAiAttachmentId);
              this.setState({ delDialogvisible: false });
            }}
          >
            Confirm
          </button>
        </div>
      </div>
    );
  }

  renderviewDialogContent() {
    return (
      <div
        className="form-group"
        style={{ fontSize: "16px", textAlign: "left" }}
      >
        <img
          style={{ width: "600px", height: "500px" }}
          src={"data:image/jpg;base64," + this.state.selectedImage}
        />
        <a
          style={{ position: "relative", top: "5%", left: "80%" }}
          download={this.state.selectedFileName}
          href={"data:image/jpg;base64," + this.state.selectedImage}
        >
          download
        </a>
      </div>
    );
  }

  handleUploadFile = event => {
    this.setState({
      selectedFile: event.target.files[0]
    });
  };

  submitPhotoGraph = () => {
    if (this.state.callMode !== "EDIT")
      this.props.handleUploadBlob(
        this.state.selectedFile,
        this.state.selectedFile.name,
        this.state.description,
        this.props.VesselID,
        this.props.Origin,
        this.props.HistID
      );
    else {
      this.props.handleEditBlob(
        this.state.selectedFile,
        this.state.selectedFile.name,
        this.state.description,
        this.state.activeAiAttachmentId,
        this.props.VesselID,
        this.props.Origin
      );
    }
    this.clearDialog();
  };

  clearDialog = () => {
    this.setState({ visible: false, description: "" });
    this.fileInput.value = "";
  };

  enableDisabelAddBtn() {
    if (this.props.blobContent.length >= 10) {
      this.setState({ enableAddBtn: true });
    } else {
      this.setState({ enableAddBtn: false });
    }
  }

  render() {
    const header = this.renderHeader();

    return (
      <div>
        <div className="content-section implementation">
          <DataView
            value={this.props.blobContent}
            layout={"grid"}
            header={header}
            itemTemplate={this.itemTemplate}
          />
        </div>
        <Dialog
          header="Add/Edit New Photograph"
          visible={this.state.visible}
          width="500px"
          modal={true}
          onHide={() => this.clearDialog()}
        >
          {this.renderAddDialogContent()}
        </Dialog>
        <Dialog
          header="Delete Photograph"
          visible={this.state.delDialogvisible}
          width="300px"
          modal={true}
          onHide={() => this.setState({ delDialogvisible: false })}
        >
          {this.renderDeleteDialogContent()}
        </Dialog>
        <Dialog
          header="View Image"
          visible={this.state.viewDialog}
          width="650px"
          modal={true}
          onHide={() => this.setState({ viewDialog: false })}
        >
          {this.renderviewDialogContent()}
        </Dialog>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    blobContent: state.reducer.blobContent,
    VesselID: state.reducer.AIdetails.VesselID,
    Origin: state.reducer.AIdetails.Origin,
    HistID: state.reducer.histID
  };
};

const dispatchAction = dispatch => {
  return {
    delBlob: AI_Hist_PhotographAttachmentsID =>
      dispatch(deleteAttachment(AI_Hist_PhotographAttachmentsID)),
    handleUploadBlob: (
      selectedFile,
      selectedFileName,
      description,
      VesselID,
      Origin,
      HistID
    ) =>
      dispatch(
        handleUpload(
          selectedFile,
          selectedFileName,
          description,
          VesselID,
          Origin,
          HistID
        )
      ),
    handleEditBlob: (
      selectedFile,
      selectedFileName,
      description,
      activeAiAttachmentId,
      VesselID,
      Origin
    ) =>
      dispatch(
        handleEditUpload(
          selectedFile,
          selectedFileName,
          description,
          activeAiAttachmentId,
          VesselID,
          Origin
        )
      )
  };
};

export default connect(
  mapStateToProps,
  dispatchAction
)(PhotoGraphs);
