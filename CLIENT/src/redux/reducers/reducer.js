import { action_contants } from "../actions/action-types";
import AIDetails from "../../components/AIDetails";

const initState = {
  histID: 0,
  AIdetails: {
    Origin: "",
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
    NoOfDefectAdded: 0,
    VesselID: -1,
    AI_AuditDetails: [],
    AI_ListID: -1
  },
  selectAIDescription: [],
  isNewReport: true,
  error: { errorMsg: null, errorInfo: null },
  blobContent: []
};

const reducer = (state = initState, action) => {
  switch (action.type) {
    case action_contants.GET_AUDIT_DETAILS:
      return {
        ...state,
        AI_AuditDetails: action.payload
      };
    case action_contants.GET_NEW_MODE_DETAILS:
      //object destructuring
      let { desc, vslDetails } = action.payload;
      let AI_listID;
      if (desc.length > 1 && state.AIdetails.AI_ListID === -1) {
        AI_listID = desc[0].AI_ListID;
      }
      return {
        ...state,
        selectAIDescription: desc,
        AIdetails: {
          ...state.AIdetails,
          ClassNo: vslDetails[0].ClassNo,
          DelivDate: vslDetails[0].DelivDate,
          Flag: vslDetails[0].Flag,
          ImoNo: vslDetails[0].ImoNo,
          AI_ListID: AI_listID
        },
        isNewReport: true
      };
    case action_contants.GET_AI_DETAILS:
      return {
        ...state,
        histID: action.histID,
        AIdetails: action.AIdetails,
        isNewReport: false
      };
    case action_contants.UPDATE_AI_DETAILS:
      return {
        ...state,
        histID: action.histID
      };
    case action_contants.GET_NEW_HIST_ID:
      return {
        ...state,
        histID: action.histID
      };
      //update AI details from previous state
      // ( redux store state updated using EDIT_AI_DETAILS )
      // state.AIdetails = { ...state.AIdetails};
      break;
    case action_contants.LOGGING_ERR:
      return {
        ...state,
        error: {
          ...state.error,
          errorMsg: action.errDetails.errorMsg,
          errorInfo: action.errDetails.errorInfo
        }
      };

    case action_contants.EDIT_AI_DETAILS:
      let key = Object.keys(action.EditAIdetails);
      return {
        ...state,
        AIdetails: {
          ...state.AIdetails,
          [key]: action.EditAIdetails[key]
        }
      };
    case action_contants.GET_BLOB:
      return {
        ...state,
        blobContent: action.blobContents
      };
    case action_contants.DELETE_PHOTOGRAPH:
      const blobsData = [...state.blobContent];
      const filteredBlobs = blobsData.filter(
        item => item.AI_Hist_PhotographAttachmentsID !== action.payload
      );
      return {
        ...state,
        blobContent: filteredBlobs
      };
    case action_contants.UPLOAD_PHOTOGRAPH:
      const {
        aiHistAttachmentID,
        NewImagebase64,
        fileName,
        description
      } = action.payload;

      let newBlobData = [...state.blobContent];

      newBlobData.push({
        AI_Hist_PhotographAttachmentsID: aiHistAttachmentID,
        Description: description,
        FileName: fileName,
        BlobContents: NewImagebase64
      });
      return {
        ...state,
        blobContent: newBlobData
      };

    case action_contants.EDIT_PHOTOGRAPH:
      const {
        editaiAttachmentId,
        NewImagebase64File,
        editFileName,
        editDescription
      } = action.payload;

      let editedBlobData = [...state.blobContent];

      const filteredBlobFiled = editedBlobData.filter(
        item => item.AI_Hist_PhotographAttachmentsID !== editaiAttachmentId
      );

      filteredBlobFiled.push({
        AI_Hist_PhotographAttachmentsID: editaiAttachmentId,
        Description: editDescription,
        FileName: editFileName,
        BlobContents: NewImagebase64File
      });
      return {
        ...state,
        blobContent: filteredBlobFiled
      };
  }

  return state;
};

export default reducer;
