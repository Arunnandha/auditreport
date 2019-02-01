import React, { Component } from "react";
import { DataView } from "primereact/dataview";
import { Panel } from "primereact/panel";
import { Dialog } from "primereact/dialog";
import { handleUpload, deleteAttachment } from "../redux/actions/services";
import { connect } from "react-redux";

class PhotoGraphs extends Component {
  constructor() {
    super();
    this.state = {
      blobs: [],
      layout: "grid",
      visible: false,
      selectedFile: null,
      activeAiAttachmentId: -1,
      delDialogvisible: false,
      description: ""
    };
    this.itemTemplate = this.itemTemplate.bind(this);
  }

  // componentDidMount() {
  //   this.btnSubmit.focus();
  // }

  componentWillReceiveProps(props) {
    this.setState({ blobs: props.BlobContents });
  }

  itemTemplate(blobs, layout) {
    if (layout === "grid") return this.renderGridItem(blobs);
  }

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
            <button
              title="Delete"
              className="btn btn-info m-2"
              onClick={e => {
                this.setState({
                  delDialogvisible: true,
                  activeAiAttachmentId: blobs.AI_Hist_PhotographAttachmentsID
                });
              }}
            >
              <i className="fas fa-trash-alt" />
            </button>
            <button
              title="Edit"
              className="btn btn-info m-2"
              onClick={e => {
                this.setState({
                  visible: true,
                  activeAiAttachmentId: blobs.AI_Hist_PhotographAttachmentsID
                });
              }}
            >
              <i className="far fa-edit" />
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
          <button
            className="btn btn-info btn-sm"
            onClick={() => {
              this.setState({ visible: true });
            }}
          >
            Add New Photograph
          </button>
        </div>
      </div>
    );
  }

  renderAddDialogContent() {
    //this.btnSubmit.focus();
    return (
      <div
        className="form-group"
        style={{ fontSize: "16px", textAlign: "left", padding: "5px" }}
      >
        <textarea
          className="form-control"
          rows="5"
          refs="txtdesc"
          value={this.state.description}
          onChange={e => this.setState({ description: e.target.value })}
        />
        <div style={{ textAlign: "left", margin: "2px" }} className="p-col-12">
          <input
            type="file"
            name="myFile"
            refs="filephotoGraphAttach"
            //value={this.state.selectedFile}
            accept="image/*"
            onChange={this.handleUploadFile}
          />
        </div>
        <div style={{ textAlign: "right" }} className="p-col-12">
          <button
            className="btn btn-outline-danger btn-sm m-2"
            onClick={() => this.setState({ visible: false })}
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

  handleUploadFile = event => {
    this.setState({
      selectedFile: event.target.files[0]
    });
  };

  submitPhotoGraph = () => {
    this.props.handleUploadBlob(
      this.state.selectedFile,
      this.state.selectedFile.name,
      this.state.description
    );
    this.setState({ visible: false, description: "" });
  };

  clearDialog = () => {};

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
          header="Add New Photograph"
          visible={this.state.visible}
          width="500px"
          modal={true}
          onHide={() => this.setState({ visible: false })}
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
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    blobContent: state.blobContent
  };
};

const dispatchAction = dispatch => {
  return {
    delBlob: AI_Hist_PhotographAttachmentsID =>
      dispatch(deleteAttachment(AI_Hist_PhotographAttachmentsID)),
    handleUploadBlob: (selectedFile, selectedFileName, description) =>
      dispatch(handleUpload(selectedFile, selectedFileName, description))
  };
};

export default connect(
  mapStateToProps,
  dispatchAction
)(PhotoGraphs);
