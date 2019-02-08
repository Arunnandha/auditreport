import { action_contants } from "../actions/action-types";

const initState = {
  histID: 0,
  AIdetails: {
    Origin: "",
    AIDescription: "",
    AuditInspection_EndDate: new Date(),
    AuditInspection_StartDate: new Date(),
    PortOfAuditInspection: "",
    AuditingCompany: "",
    AuditorName: "",
    ReportDate: new Date(),
    ReportBy: "",
    ReportByRole_Rank: "",
    SuptName: "",
    MasterName: "",
    ClassNo: "",
    Flag: "",
    DelivDate: new Date(),
    ImoNo: "",
    NoOfDefectAdded: 0,
    VesselID: -1,
    AI_AuditDetails: []
  },
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
    case action_contants.GET_AI_DETAILS:
      return {
        ...state,
        histID: action.histID,
        AIdetails: action.AIdetails,
        isNewReport: false
      };
    case action_contants.UPDATE_AI_DETAILS:
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
        },
        isNewReport: false
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
