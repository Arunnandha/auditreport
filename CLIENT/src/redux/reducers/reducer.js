const initState = {
  histID: 0,
  AIdetails: {
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
    NoOfDefectAdded: 0
  },
  isNewReport: true,
  error: { errorMsg: null, errorInfo: null },
  blobContent: []
};

const reducer = (state = initState, action) => {
  switch (action.type) {
    case "GET_AI_DETAILS":
      return {
        ...state,
        histID: action.histID,
        AIdetails: action.AIdetails,
        isNewReport: false
      };
    case "UPDATE_AI_DETAILS":
      //update AI details from previous state
      // ( redux store state updated using EDIT_AI_DETAILS )
      // state.AIdetails = { ...state.AIdetails};
      break;
    case "LOGGING_ERR":
      return {
        ...state,
        error: {
          ...state.error,
          errorMsg: action.errDetails.errorMsg,
          errorInfo: action.errDetails.errorInfo
        }
      };

    case "EDIT_AI_DETAILS":
      let key = Object.keys(action.EditAIdetails);
      return {
        ...state,
        AIdetails: {
          ...state.AIdetails,
          [key]: action.EditAIdetails[key]
        },
        isNewReport: false
      };
    case "GET_BLOB":
      return {
        ...state,
        blobContent: action.blobContents
      };
    case "DELETE_PHOTOGRAPH":
      const blobsData = [...state.blobContent];
      const filteredBlobs = blobsData.filter(
        item => item.AI_Hist_PhotographAttachmentsID !== action.payload
      );
      return {
        ...state,
        blobContent: filteredBlobs
      };
    case "UPLOAD_PHOTOGRAPH":
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
  }

  return state;
};
export default reducer;
