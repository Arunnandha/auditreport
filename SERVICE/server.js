var express = require("express");
var app = express();
var mssql = require("mssql");
var cors = require("cors");
const bodyParser = require("body-parser");
var formidable = require("formidable");
var fs = require("fs");
var blobControl = require("./blobController");
var jwt = require("jsonwebtoken");
var configFile = require("./config/config.js");
var config = configFile.config;
var securitySettings = {
  secretkey: "my_secret_key"
};

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());

app.get("/getAIdetails/:histID/:vesselID", async (req, res) => {
  var histID = req.params.histID;
  var vesselID = req.params.vesselID;
  try {
    let conn = await mssql.connect(config);
    let result1 = await conn
      .request()
      .input("AI_HistID", mssql.BigInt, histID)
      .input("vesselID", mssql.Int, vesselID)
      .execute("usp_AI_RN_GetAIDetails");

    mssql.close();
    res.send(result1.recordset);
  } catch (err) {
    console.log("err--getAIdetails-->>>>>" + err);
    mssql.close();
    res.status(400).send("query error" + err);
  }
});
mssql.on("error", err => {
  // ... error handler
  console.log("from error handler", err);
});
app.post("/updateAIdetails/", async (req, res) => {
  // console.log("updatedDetails", req.body.updatedDetails);
  var AI_Updated_details = req.body.updatedDetails;
  var histID = req.body.histID;
  var VesselID = req.body.VesselID;
  var Origin = req.body.Origin;
  var AI_ListID = req.body.AI_ListID;
  var flag = req.body.flag;
  var reportby = req.body.curUsrName;
  var New_HistID = 0;
  var curUsrRank = req.body.curUsrRank;
  var new_Ref_Code = 0;
  var newAIListVslID = 0;

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
      .input("ReportBy", mssql.VarChar(50), reportby)
      .input("ReportByRole_Rank", mssql.VarChar(50), curUsrRank)
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
      .input("LastActionUserID", mssql.VarChar(50), "")
      .input("NoObservations", mssql.Int, 0)
      .input("AI_HistID", mssql.BigInt, histID)
      .input("VesselID", mssql.Int, VesselID)
      .input("Origin", mssql.VarChar(3), Origin)
      .input("AI_ListID", mssql.Int, AI_ListID)
      .input("callMode", mssql.VarChar(10), flag)
      .input("Remarks", mssql.VarChar(10), "")
      .output("new_HistID", New_HistID)
      .output("new_Ref_Code", new_Ref_Code)
      .output("newAIListVslID", newAIListVslID)
      .execute("usp_AI_RN_UpdateAIDetails");

    mssql.close();
    res.send({
      histID: result1.output.new_HistID,
      Ref_Code: result1.output.new_Ref_Code,
      aiListVslId: result1.output.newAIListVslID
    });
  } catch (err) {
    console.log("err--updateAIdetails-->>>>>" + err);
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
    var AIListID = fields.AIListID;
    var AIListVslID = fields.AIListVslID;
    var userName = fields.userName;
    var rank = fields.rank;
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
          histID,
          AIListID,
          AIListVslID,
          userName,
          rank
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
    console.log("err--deleteAIPhotographs-->>>>>" + err);
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
    var AIListID = fields.AIListID;
    var AIListVslID = fields.AIListVslID;
    var userName = fields.userName;
    var rank = fields.rank;
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
          Origin,
          AIListID,
          AIListVslID,
          userName,
          rank
        );
      });
    });
  });
});
app.post("/checkUserDetails", async (req, res) => {
  var userName = req.body.userName;
  var passWord = req.body.psswd;
  var vesselID = req.body.vesselID;
  var isHqUser = 0;
  var qryStr = "";
  var exp = /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
  if (exp.test(String(userName).toLowerCase())) isHqUser = 1;

  try {
    let conn = await mssql.connect(config);
    let result1 = await conn
      .request()
      .input("user_name", mssql.VarChar(40), userName)
      .input("password", mssql.VarChar(40), passWord)
      .input("vesselID", mssql.Int, vesselID)
      .input("isHqUser", mssql.Int, isHqUser)
      .execute("usp_AI_RN_ValidatingUser");
    mssql.close();
    if (result1.recordset.length > 0) {
      res.json({
        userinfo: result1.recordset,
        token: jwt.sign({ passWord }, securitySettings.secretkey)
      });
    } else res.sendStatus(400);
  } catch (err) {
    console.log("err--checkUserDetails-->>>>>" + err);
    mssql.close();
  }
});

app.get("/getVslCode/", async (req, res) => {
  try {
    let conn = await mssql.connect(config);
    let result1 = await conn.request().execute(`usp_AI_RN_getVslCodeList`);
    mssql.close();
    res.send(result1.recordset);
  } catch (err) {
    console.log("err--getVslCode-->>>>>" + err);
    mssql.close();
  }
});

//when click New audit in client
app.post("/getNewModeDetails", async (req, res) => {
  try {
    var Origin = req.body.origin;
    var VesselID = req.body.vesselID;
    var auditType = req.body.auditType;

    let conn = await mssql.connect(config);
    let result1 = await conn
      .request()
      .input("origin", mssql.VarChar(3), Origin)
      .input("auditType", mssql.VarChar(20), auditType)
      .input("VesselID", mssql.Int, VesselID)
      .execute("usp_AI_RN_GetAIList_VSLdetails");

    mssql.close();
    res.send({
      desc: result1.recordsets[0],
      vslDetails: result1.recordsets[1]
    });
  } catch (err) {
    console.log("err--GetNewModeDetails-->>>>>" + err);
    mssql.close();
  }
});
//when click open audit in client
app.post("/getAuditDetailsList", async (req, res) => {
  var VesselID = req.body.VesselID;
  var Origin = req.body.Origin;
  var auditType = req.body.auditType;

  try {
    let conn = await mssql.connect(config);
    let result1 = await conn
      .request()
      .input("origin", mssql.VarChar(3), Origin)
      .input("auditType", mssql.VarChar(20), auditType)
      .input("VesselID", mssql.Int, VesselID)
      .execute("usp_AI_RN_GetAuditDetailsList");
    mssql.close();

    res.send(result1.recordsets);
  } catch (err) {
    console.log("err--getAuditDetails-->>>>>" + err);
    mssql.close();
  }
});

app.post("/getAILogDetails", async (req, res) => {
  var VesselID = req.body.vesselID;
  var AIListID = req.body.AIListID;
  var AIListVslID = req.body.AIListVslID;

  try {
    console.log(VesselID + AIListID + AIListVslID);
    let conn = await mssql.connect(config);
    let result1 = await conn
      .request()
      .input("AIListID", mssql.BigInt, AIListID)
      .input("AIListVslID", mssql.BigInt, AIListVslID)
      .input("VesselID", mssql.Int, VesselID)
      .execute("usp_AI_RN_GetAILog");

    mssql.close();

    res.send(result1.recordset);
  } catch (err) {
    console.log("err--getAILogDetails-->>>>>" + err);
    mssql.close();
  }
});

mssql.on("error", err => {
  // ... error handler
});

app.listen(5000, () => {
  console.log("server running at port 5000");
});
