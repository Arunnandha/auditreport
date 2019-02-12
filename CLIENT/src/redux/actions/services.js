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

        let AIdetails = res.data[0];

        dispatch({
          type: action_contants.GET_AI_DETAILS,
          AIdetails: AIdetails,
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
export const updateAIdetailsToDB = (
  updatedDetails,
  histID,
  Origin,
  AI_ListID,
  flag,
  vesselID
) => {
  return dispatch => {
    axios
      .post(`${apiUrl}/updateAIdetails/`, {
        updatedDetails: updatedDetails,
        histID: histID,
        Origin: Origin,
        AI_ListID: AI_ListID,
        flag: "Edit",
        VesselID: localStorage.getItem("vesselID")
      })
      .then(res => {
        console.log("res from update", res);
        dispatch({
          type: action_contants.UPDATE_AI_DETAILS,
          histID: res.data
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
    data.append("VesselID", localStorage.getItem("vesselID"));
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
  let vesselID = localStorage.getItem("vesselID");
  axios
    .get(`${apiUrl}/getAIPhotographs/${histID}/${vesselID}/${Origin}`)
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
    data.append("VesselID", localStorage.getItem("vesselID"));
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
export const getAduitDetailsFromDB = () => {
  //get origin from localstorage
  let Origin = JSON.parse(localStorage.getItem("user")).userinfo[0].Origin;
  let VesselID = localStorage.getItem("vesselID");
  return dispatch => {
    axios
      .post(`${apiUrl}/getAuditDetails`, { VesselID: VesselID, Origin: Origin })
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
export const getNewModeDetailsFromDB = updatedDetails => {
  //get vesselID and origin from local storage
  let VesselID = localStorage.getItem("vesselID");
  let Origin = JSON.parse(localStorage.getItem("user")).userinfo[0].Origin;

  return dispatch => {
    axios
      .post(`${apiUrl}/getNewModeDetails`, {
        origin: Origin,
        vesselID: VesselID
      })
      .then(res => {
        console.log("getNewModeDetailsFromDB", res);

        //get new HistID when click "New Audit"
        // this method will dispatch the "GET_NEW_HIST_ID" action
        getNewHistID(updatedDetails, -1, Origin, -1, "New", VesselID, dispatch);

        dispatch({
          type: action_contants.GET_NEW_MODE_DETAILS,
          payload: res.data
        });
      })
      .catch(err => {
        console.log(err);
      });
  };
};

//dispatch the "GET_NEW_HIST_ID" action
export const getNewHistID = (
  updatedDetails,
  histID,
  Origin,
  AI_ListID,
  flag,
  vesselID,
  dispatch
) => {
  axios
    .post(`${apiUrl}/updateAIdetails/`, {
      updatedDetails: updatedDetails,
      histID: histID,
      Origin: Origin,
      AI_ListID: AI_ListID,
      flag: flag,
      VesselID: vesselID
    })
    .then(res => {
      console.log("res from update", res);
      dispatch({
        type: action_contants.GET_NEW_HIST_ID,
        histID: res.data
      });
    })
    .catch(err => {
      console.log(err);
    });
};
