import { action_contants } from "./action-types";
import axios from "axios";
import { history } from "../../index.js";

//get AI details
const apiUrl = "http://localhost:5000";
export const getAIdetailsFromDB = histID => {
  return dispatch => {
    var vesselID = localStorage.getItem("vesselID");
    axios
      .get(`${apiUrl}/getAIdetails/${histID}/${vesselID}`)
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
  vesselID,
  dispatch
) => {
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
      history.push("/openAudit");
      alert("AI Details Updated Successfully");
    })
    .catch(err => {
      console.log(err);
    });
};

export const handleUpload = (
  imgFile,
  fileName,
  description,
  vesselID,
  Origin,
  HistID,
  AIListID,
  AIListVslID,
  userName,
  rank
) => {
  return dispatch => {
    let data = new FormData();

    data.append("file", imgFile, fileName);
    data.append("description", description);
    data.append("VesselID", localStorage.getItem("vesselID"));
    data.append("Origin", Origin);
    data.append("HistID", HistID);
    data.append("AIListID", AIListID);
    data.append("AIListVslID", AIListVslID);
    data.append("userName", userName);
    data.append("rank", rank);

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
  Origin,
  AIListID,
  AIListVslID,
  userName,
  rank
) => {
  return dispatch => {
    let data = new FormData();
    data.append("file", editaiImagebase64File, editFileName);
    data.append("description", editDescription);
    data.append("AI_Hist_PhotographAttachmentsID", editaiAttachmentId);
    data.append("VesselID", localStorage.getItem("vesselID"));
    data.append("Origin", Origin);
    data.append("AIListID", AIListID);
    data.append("AIListVslID", AIListVslID);
    data.append("userName", userName);
    data.append("rank", rank);

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
export const getAuditDetailsFromDB = auditType => {
  //get origin from localstorage
  let Origin = JSON.parse(localStorage.getItem("user")).userinfo[0].Origin;
  let VesselID = localStorage.getItem("vesselID");
  return dispatch => {
    axios
      .post(`${apiUrl}/getAuditDetailsList`, {
        VesselID: VesselID,
        Origin: Origin,
        auditType: auditType
      })
      .then(res => {
        console.log(res.data);

        dispatch({
          type: action_contants.GET_AUDIT_DETAILS_LIST,
          payload: res.data
        });
      })
      .catch(err => {
        console.log(err);
      });
  };
};
export const getNewModeDetailsFromDB = auditType => {
  //get vesselID and origin from local storage
  let VesselID = localStorage.getItem("vesselID");
  let Origin = JSON.parse(localStorage.getItem("user")).userinfo[0].Origin;
  return dispatch => {
    if (localStorage.getItem("vesselID") == -1) {
      alert(auditType);

      dispatch({
        type: action_contants.GET_NEW_MODE_DETAILS,
        payload: {
          desc: "",
          vslDetails: [{ ClassNo: "", DelivDate: "", Flag: "", ImoNo: "" }]
        }
      });
    } else
      axios
        .post(`${apiUrl}/getNewModeDetails`, {
          origin: Origin,
          vesselID: VesselID,
          auditType: auditType
        })
        .then(res => {
          dispatch({
            type: action_contants.GET_NEW_MODE_DETAILS,
            payload: res.data
          });
          console.log("getNewModeDetailsFromDB", res);
        })
        .catch(err => {
          console.log(err);
        });
  };
};

export const getNewReportFromDB = (newAIdetails, AI_ListID, AIDescription) => {
  //get vesselID and origin from local storage
  let VesselID = localStorage.getItem("vesselID");
  let Origin = JSON.parse(localStorage.getItem("user")).userinfo[0].Origin;
  let curusrnameRank = JSON.parse(localStorage.getItem("user")).userinfo[0];

  return dispatch => {
    //get new HistID when click "New Audit"
    // this method will dispatch the "GET_NEW_HIST_ID" action

    axios
      .post(`${apiUrl}/updateAIdetails/`, {
        updatedDetails: newAIdetails,
        histID: -1,
        Origin: Origin,
        AI_ListID: AI_ListID,
        flag: "NEW",
        VesselID: VesselID,
        curUsrName: curusrnameRank.UserName,
        curUsrRank: curusrnameRank.Role
      })
      .then(res => {
        console.log("res from update", res);
        dispatch({
          type: action_contants.GET_NEW_HIST_ID,
          histID: res.data.histID,
          Ref_Code: res.data.Ref_Code,
          ai_listVslId: res.data.aiListVslId,
          AI_ListID: AI_ListID,
          AIDescription: AIDescription
        });
      })
      .catch(err => {
        console.log(err);
      });
  };
};

export const getAIReportLog = (AIListID, AIListVslID, vesselID) => {
  return dispatch => {
    axios
      .post(`${apiUrl}/getAILogDetails`, {
        AIListID: AIListID,
        AIListVslID: AIListVslID,
        vesselID: vesselID
      })
      .then(res => {
        console.log("log", res);
        dispatch({
          type: action_contants.GET_LOG_DETAILS,
          payload: res.data
        });
      })
      .catch(err => {
        console.log(err);
      });
  };
};
