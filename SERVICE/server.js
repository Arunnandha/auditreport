var express = require("express");
var app = express();
var mssql = require("mssql");
var cors = require("cors");
const bodyParser = require("body-parser");
var formidable = require("formidable");
var fs = require("fs");
var blobControl = require("./blobController");

var configFile = require("./config/config");
var config = configFile.config;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());

app.get("/getAIdetails/:histID", async (req, res) => {
  var histID = req.params.histID;
  // console.log("histID", histID);
  try {
    let conn = await mssql.connect(config);
    let result1 = await conn
      .request()
      .input("AI_HistID", mssql.BigInt, histID)
      .execute("usp_AI_RN_GetAIDetails");

    mssql.close();
    res.send(result1.recordset);
  } catch (err) {
    console.log("err---->>>>>" + err);
    mssql.close();
    res.status(400).send("query error" + err);
  }
});
mssql.on("error", err => {
  // ... error handler
});
app.post("/updateAIdetails/", async (req, res) => {
  // console.log("updatedDetails", req.body.updatedDetails);
  var AI_Updated_details = req.body.updatedDetails;
  var histID = req.body.histID;

  // console.log("histID update", req.body.histID);
  try {
    let conn = await mssql.connect(config);
    let result1 = await conn
      .request()
      .input(
        "AuditInspection_StartDate",
        mssql.VarChar(50),
        AI_Updated_details.AuditInspection_StartDate
      )
      .input(
        "AuditInspection_EndDate",
        mssql.VarChar(50),
        AI_Updated_details.AuditInspection_EndDate
      )
      .input(
        "PortOfAuditInspection",
        mssql.VarChar(50),
        AI_Updated_details.PortOfAuditInspection
      )
      .input(
        "AuditingCompany",
        mssql.VarChar(50),
        AI_Updated_details.AuditingCompany
      )
      .input("AuditorName", mssql.VarChar(50), AI_Updated_details.AuditorName)
      .input("ReportDate", mssql.VarChar(50), AI_Updated_details.ReportDate)
      .input("ReportBy", mssql.VarChar(50), AI_Updated_details.ReportBy)
      .input(
        "ReportByRole_Rank",
        mssql.VarChar(50),
        AI_Updated_details.ReportByRole_Rank
      )
      .input("MasterName", mssql.VarChar(50), AI_Updated_details.MasterName)
      .input("SuptName", mssql.VarChar(50), AI_Updated_details.SuptName)
      .input("ReportType", mssql.VarChar(50), "inspection")
      .input("AI_StatusID", mssql.Int, 10)
      .input("TotalObservations", mssql.Int, 0)
      .input("HasAttachements", mssql.Int, 0)
      .input("HasDefectsAdded", mssql.Int, 0)
      .input("NoOfDefectAdded", mssql.Int, 0)
      .input("NoOfNCRAdded", mssql.Int, 0)
      .input("NoOfTaskAdded", mssql.Int, 0)
      .input("HasPhotographAttachments", mssql.Int, 0)
      .input("LastActionUserID", mssql.VarChar(50), "MASTER")
      .input("NoObservations", mssql.Int, 0)
      .input("AI_HistID", mssql.BigInt, histID)
      .input("VesselID", mssql.Int, AI_Updated_details.VesselID)
      .execute("usp_AI_RN_UpdateAIDetails");

    mssql.close();
    res.send(result1.recordset);
  } catch (err) {
    console.log("err---->>>>>" + err);
    mssql.close();
    res.status(400).send("query error" + err);
  }
});
app.post("/upLoadImageFile", async (req, res) => {
  var form = new formidable.IncomingForm();
  form.parse(req, async function(err, fields, files) {
    var oldpath = files.file.path;
    var desc = fields.description;
    var fileName = files.file.name;
    var fileExtension = files.file.type.split("/").pop();
    var fileSize = files.file.size;
    var companyID = 1;
    var VesselID = fields.VesselID;
    var Origin = fields.Origin;
    var histID = fields.HistID;
    var tableName = "AI_Hist_PhotographAttachments";
    var fileContent;
    var newpath = "C:/wdir/" + fileName;
    fs.rename(oldpath, newpath, async function(err) {
      if (err) throw err;
      fs.readFile(newpath, async function(err, data) {
        fileContent = await new Buffer(data);

        blobControl.uploadFile(
          req,
          res,
          desc,
          fileName,
          fileExtension,
          fileContent,
          fileSize,
          companyID,
          tableName,
          VesselID,
          newpath,
          Origin,
          histID
        );
      });

      // res.write('File uploaded and moved!');
      // res.end();
    });
  });
});

app.get("/getAIPhotographs/:histID/:VesselID/:Origin", async (req, res) => {
  var histID = req.params.histID;
  var Origin = req.params.Origin;
  var photographData;
  var companyID = 1;
  var VesselID = req.params.VesselID;
  var tableName = "AI_Hist_PhotographAttachments";
  photographData = await blobControl.downloadFile(
    req,
    res,
    companyID,
    VesselID,
    tableName,
    histID,
    Origin
  );
});
app.post("/deleteAIPhotographs/", async (req, res) => {
  var attchmentId = req.body.aiHistAttachmentID;

  try {
    let conn = await mssql.connect(config);
    let result1 = await conn
      .request()
      .query(
        `update AI_Hist_PhotographAttachments set IsDeleted=1 where  AI_Hist_PhotographAttachmentsID=${attchmentId}`
      );
    mssql.close();

    res.send("ok");
  } catch (err) {
    console.log("err---->>>>>" + err);
    mssql.close();
  }
});
app.post("/editUploadImageFile/", async (req, res) => {
  var form = new formidable.IncomingForm();
  form.parse(req, async function(err, fields, files) {
    var aiHistPhotoGraphAttachmentID = fields.AI_Hist_PhotographAttachmentsID;
    var oldpath = files.file.path;
    var desc = fields.description;
    var fileName = files.file.name;
    var fileExtension = files.file.type.split("/").pop();
    var fileSize = files.file.size;
    var companyID = 1;
    var VesselID = fields.VesselID;
    var Origin = fields.Origin;
    var tableName = "AI_Hist_PhotographAttachments";
    var fileContent;
    var newpath = "C:/wdir/" + fileName;
    fs.rename(oldpath, newpath, async function(err) {
      if (err) throw err;
      fs.readFile(newpath, async function(err, data) {
        fileContent = await new Buffer(data);
        blobControl.editFile(
          req,
          res,
          aiHistPhotoGraphAttachmentID,
          desc,
          fileName,
          fileExtension,
          fileSize,
          companyID,
          VesselID,
          tableName,
          newpath,
          fileContent,
          Origin
        );
      });
    });
  });
});

mssql.on("error", err => {
  // ... error handler
});

app.listen(5000, () => {
  console.log("server running at port 5000");
});
