import { action_contants } from "./action-types";
import axios from "axios";

//get AI details
const apiUrl = "http://localhost:5000";
export const getAIdetailsFromDB = histID => {
  return dispatch => {
    axios
      .get(`${apiUrl}/getAIdetails/${histID}`)
      .then(res => {
        console.log(res.data);
        dispatch({
          type: action_contants.GET_AI_DETAILS,
          AIdetails: res.data[0],
          histID: histID
        });
        let vesselID = res.data[0].VesselID;
        let origin = res.data[0].Origin;
        getAIHistAttachment(histID, vesselID, origin, dispatch);
      })
      .catch(err => {
        console.log(err);
      });
  };
};

// update AIdetails -- Edited details got from header component
export const updateAIdetailsToDB = (updatedDetails, histID) => {
  return dispatch => {
    axios
      .post(`${apiUrl}/updateAIdetails/`, {
        updatedDetails: updatedDetails,
        histID: histID
      })
      .then(res => {
        dispatch({
          type: action_contants.UPDATE_AI_DETAILS
        });
        alert("AI Details Updated Successfully");
      })
      .catch(err => {
        console.log(err);
      });
  };
};

export const handleUpload = (
  imgFile,
  fileName,
  description,
  vesselID,
  Origin,
  HistID
) => {
  return dispatch => {
    let data = new FormData();

    data.append("file", imgFile, fileName);
    data.append("description", description);
    data.append("VesselID", vesselID);
    data.append("Origin", Origin);
    data.append("HistID", HistID);
    let config = {
      headers: {
        "Content-Type": "multipart/form-data"
      }
    };
    //convert local image file into base64
    var NewImagebase64 = "";
    var file = imgFile;
    var reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = function() {
      NewImagebase64 = reader.result.split("base64,").pop();
    };

    //upload new photograph and get new "aiHistAttachmentID".
    axios.post(`${apiUrl}/upLoadImageFile/`, data, config).then(res => {
      let aiHistAttachmentID = res.data;
      console.log(res.data);
      //when got response from upLoadImageFile, newly added photograph will render in client
      dispatch({
        type: action_contants.UPLOAD_PHOTOGRAPH,
        payload: { aiHistAttachmentID, NewImagebase64, fileName, description }
      });
    });
  };
};

//download  photograph from db/azure
export const getAIHistAttachment = (histID, VesselID, Origin, dispatch) => {
  axios
    .get(`${apiUrl}/getAIPhotographs/${histID}/${VesselID}/${Origin}`)
    .then(res => {
      dispatch({
        type: action_contants.GET_BLOB,
        blobContents: res.data
      });
    })
    .catch(err => {
      console.log(err);
    });
};

//delete photograph attachment
export const deleteAttachment = aiHistAttachmentID => {
  return dispatch => {
    axios
      .post(`${apiUrl}/deleteAIPhotographs/`, {
        aiHistAttachmentID: aiHistAttachmentID
      })
      .then(res => {
        dispatch({
          type: action_contants.DELETE_PHOTOGRAPH,
          payload: aiHistAttachmentID
        });
      })
      .catch(err => {
        console.log(err);
      });
  };
};

//update the Edited photograph attachment details
export const handleEditUpload = (
  editaiImagebase64File,
  editFileName,
  editDescription,
  editaiAttachmentId,
  VesselID,
  Origin
) => {
  return dispatch => {
    let data = new FormData();
    data.append("file", editaiImagebase64File, editFileName);
    data.append("description", editDescription);
    data.append("AI_Hist_PhotographAttachmentsID", editaiAttachmentId);
    data.append("VesselID", VesselID);
    data.append("Origin", Origin);
    let config = {
      headers: {
        "Content-Type": "multipart/form-data"
      }
    };
    //convert local image file into base64
    var NewImagebase64File = "";
    var reader = new FileReader();
    reader.readAsDataURL(editaiImagebase64File);
    reader.onloadend = function() {
      NewImagebase64File = reader.result.split("base64,").pop();
    };

    axios.post(`${apiUrl}/editUploadImageFile/`, data, config).then(res => {
      //when got response from upLoadImageFile, newly added photograph will render in client
      dispatch({
        type: action_contants.EDIT_PHOTOGRAPH,
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
export const getAduitDetailsFromDB = vesselID => {
  return dispatch => {
    axios
      .post(`${apiUrl}/getAuditDetails`, { VesselID: vesselID })
      .then(res => {
        console.log(res.data);
        dispatch({
          type: action_contants.GET_AUDIT_DETAILS,
          payload: res.data
        });
      })
      .catch(err => {
        console.log(err);
      });
  };
};
