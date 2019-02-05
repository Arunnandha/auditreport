import * as action from "./action-types";
import axios from "axios";

export const getAIdetailsFromDB = histID => {
  return dispatch => {
    axios
      .get(`http://localhost:5000/getAIdetails/${histID}`)
      .then(res => {
        console.log(res.data);
        dispatch({
          type: action.GET_AI_DETAILS,
          AIdetails: res.data[0],
          histID: histID
        });
        getAIHistAttachment(histID, res.data[0].VesselID, dispatch);
      })
      .catch(err => {
        console.log(err);
      });
  };
};

export const updateAIdetailsFromDB = (updatedDetails, histID) => {
  return dispatch => {
    axios
      .post(`http://localhost:5000/updateAIdetails/`, {
        updatedDetails: updatedDetails,
        histID: histID
      })
      .then(res => {
        dispatch({
          type: action.UPDATE_AI_DETAILS
        });
        alert("AI Details Updated Successfully");
      })
      .catch(err => {
        console.log(err);
      });
  };
};

export const handleUpload = (imgFile, fileName, description, vesselID) => {
  return dispatch => {
    let data = new FormData();

    data.append("file", imgFile, fileName);
    data.append("description", description);
    data.append("VesselID", vesselID);
    // data.append("fileExtension", fileExtension);
    let config = {
      headers: {
        "Content-Type": "multipart/form-data"
      }
    };
    var NewImagebase64 = "";
    var file = imgFile;
    var reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = function() {
      NewImagebase64 = reader.result.split("base64,").pop();
    };

    axios
      .post(`http://localhost:5000/upLoadImageFile/`, data, config)
      .then(res => {
        let aiHistAttachmentID = res.data;
        console.log(res.data);
        dispatch({
          type: action.UPLOAD_PHOTOGRAPH,
          payload: { aiHistAttachmentID, NewImagebase64, fileName, description }
        });
      });
  };
};

export const getAIHistAttachment = (histID, VesselID, dispatch) => {
  axios
    .get(`http://localhost:5000/getAIPhotographs/${histID}/${VesselID}`)
    .then(res => {
      dispatch({
        type: action.GET_BLOB,
        blobContents: res.data
      });
    })
    .catch(err => {
      console.log(err);
    });
};

export const deleteAttachment = aiHistAttachmentID => {
  return dispatch => {
    axios
      .post(`http://localhost:5000/deleteAIPhotographs/`, {
        aiHistAttachmentID: aiHistAttachmentID
      })
      .then(res => {
        dispatch({
          type: action.DELETE_PHOTOGRAPH,
          payload: aiHistAttachmentID
        });
      })
      .catch(err => {
        console.log(err);
      });
  };
};

export const handleEditUpload = (
  editaiImagebase64File,
  editFileName,
  editDescription,
  editaiAttachmentId,
  VesselID
) => {
  return dispatch => {
    let data = new FormData();
    data.append("file", editaiImagebase64File, editFileName);
    data.append("description", editDescription);
    data.append("AI_Hist_PhotographAttachmentsID", editaiAttachmentId);
    data.append("VesselID", VesselID);
    let config = {
      headers: {
        "Content-Type": "multipart/form-data"
      }
    };

    var NewImagebase64File = "";
    var reader = new FileReader();
    reader.readAsDataURL(editaiImagebase64File);
    reader.onloadend = function() {
      NewImagebase64File = reader.result.split("base64,").pop();
    };

    axios
      .post(`http://localhost:5000/editUploadImageFile/`, data, config)
      .then(res => {
        dispatch({
          type: action.EDIT_PHOTOGRAPH,
          payload: {
            editaiAttachmentId,
            NewImagebase64File,
            editFileName,
            editDescription
          }
        });
      });
  };
};
