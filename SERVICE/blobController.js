var mssql = require("mssql");
var azure = require("azure-storage");
var fs = require("fs");
//
var configFile = require("./config/config.js");

var config = configFile.config;
//Paste Azure details
var azureDetails = require("./config/azureDetails.js");

var accessKey = azureDetails.accessKey;
var storageAccount = azureDetails.storageAccount;
var container = azureDetails.container;

module.exports = {
  uploadFile: function(
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
    filepath,
    Origin,
    histID
  ) {
    //last parameter is a function
    GetStorageOption(Origin, companyID, VesselID, tableName, (data, err) => {
      if (data) {
        var strHQ_Storage_Option = data[0].HQ_Storage_Option;

        console.log(
          "strHQ_Storage_Option before call :+ " + strHQ_Storage_Option
        );

        //If storage option "database" Attachment should be uploaded to database
        //otherwise Attachment should be uploaded to clould
        //If cloud attachment only present in clould other details shared in database.

        if (strHQ_Storage_Option.toUpperCase() == "database".toUpperCase()) {
          console.log("strHQ_Storage_Option + " + strHQ_Storage_Option);
          uploadFileToDB(
            req,
            res,
            desc,
            fileName,
            fileExtension,
            fileContent,
            fileSize,
            VesselID,
            histID
          );
        } else if (strHQ_Storage_Option == "Cloud") {
          uploadFileToAzure(
            req,
            res,
            desc,
            fileName,
            fileExtension,
            fileContent,
            fileSize,
            filepath,
            VesselID,
            histID
          );
        } else {
          console.log("Error while retrieve storage option");
        }
      }
    });

    // uploadFileToDB
    async function uploadFileToDB(
      req,
      res,
      desc,
      fileName,
      fileExtension,
      fileContent,
      fileSize,
      VesselID,
      histID
    ) {
      var AI_HistPhotoGraphID = 0;
      try {
        let conn = await mssql.connect(config);
        let result1 = await conn
          .request()
          .input("Origin", mssql.VarChar(50), "VSL")
          .input("VesselId", mssql.Int, VesselID)
          .input("AI_HistID", mssql.BigInt, histID)
          .input("RefKeyWord", mssql.VarChar(25), "PhotographAttachment")
          .input("Purpose", mssql.VarChar(50), "")
          .input("Description", mssql.VarChar(250), desc)
          .input("FileName", mssql.VarChar(150), fileName)
          .input("FileType", mssql.VarChar(5), fileExtension)
          .input("OriginalFileType", mssql.VarChar(5), fileExtension)
          .input("BlobContents", mssql.Image, fileContent)
          .input("BlobSize", mssql.Int, fileSize)
          .input("OriginalFileSize", mssql.Int, fileSize)
          .input("Confirmed", mssql.Int, 1)
          .input("IsDeleted", mssql.Int, 0)
          .input("HQ_Storage_Option", mssql.VarChar(50), "")
          .input("VSL_Storage_Option", mssql.VarChar(50), "Database")
          .input("VSL_DatabaseName", mssql.VarChar(50), "")
          .input("HQ_DatabaseName", mssql.VarChar(50), "")
          .input("Cloud_ContainerName", mssql.VarChar(150), "")
          .input("Cloud_Directory", mssql.VarChar(150), "")
          .input("HQ_Local_Folder", mssql.VarChar(250), "")
          .input("VSL_Local_Folder", mssql.VarChar(250), "")
          .input("AddedOn", mssql.DateTime, new Date())
          .input("IsUploaded", mssql.Int, 1)
          .output("Newai_HistPhotoGraphID", AI_HistPhotoGraphID)
          .execute("usp_AI_RN_UploadPhotoGraphToDB");

        mssql.close();
        res.send(result1.output.Newai_HistPhotoGraphID);
      } catch (err) {
        console.log("err from upload file from db" + err);
        mssql.close();
      }
    }

    //uploadFileToAzure
    function uploadFileToAzure(
      req,
      res,
      desc,
      fileName,
      fileExtension,
      fileContent,
      fileSize,
      filepath,
      VesselID,
      histID
    ) {
      var AI_HistPhotoGraphID = 0;
      var result1;
      console.log("file path", filepath);
      fs.readFile(filepath, async function(err, data) {
        if (!err) {
          try {
            let conn = await mssql.connect(config);
            result1 = await conn
              .request()
              .input("Origin", mssql.VarChar(50), "VSL")
              .input("VesselId", mssql.Int, VesselID)
              .input("AI_HistID", mssql.BigInt, histID)
              .input("RefKeyWord", mssql.VarChar(25), "PhotographAttachment")
              .input("Purpose", mssql.VarChar(50), "")
              .input("Description", mssql.VarChar(250), desc)
              .input("FileName", mssql.VarChar(150), fileName)
              .input("FileType", mssql.VarChar(5), fileExtension)
              .input("OriginalFileType", mssql.VarChar(5), fileExtension)
              .input("BlobContents", mssql.Image, null)
              .input("BlobSize", mssql.Int, fileSize)
              .input("OriginalFileSize", mssql.Int, fileSize)
              .input("Confirmed", mssql.Int, 1)
              .input("IsDeleted", mssql.Int, 0)
              .input("HQ_Storage_Option", mssql.VarChar(50), "Cloud")
              .input("VSL_Storage_Option", mssql.VarChar(50), "")
              .input("VSL_DatabaseName", mssql.VarChar(50), "")
              .input("HQ_DatabaseName", mssql.VarChar(50), "")
              .input("Cloud_ContainerName", mssql.VarChar(150), "")
              .input("Cloud_Directory", mssql.VarChar(150), "")
              .input("HQ_Local_Folder", mssql.VarChar(250), "")
              .input("VSL_Local_Folder", mssql.VarChar(250), "")
              .input("AddedOn", mssql.DateTime, new Date())
              .input("IsUploaded", mssql.Int, 1)
              .output("Newai_HistPhotoGraphID", AI_HistPhotoGraphID)
              .execute("usp_AI_RN_UploadPhotoGraphToDB");

            console.log("newly inserted value ", AI_HistPhotoGraphID);

            mssql.close();
            console.log("result db -->", result1);
          } catch (err) {
            console.log("err--uploadFileToAzure-->>>>>" + err);
            mssql.close();
          }
          //Creating blob service for read,create ,delete & update files from azure.
          var blobService = azure.createBlobService(storageAccount, accessKey);
          var t = "unable to connect";
          blobService.createContainerIfNotExists(container, function(
            error,
            result,
            response
          ) {
            if (!error) {
              t = "could connec t to conatiner...";
              console.log("Connecting blob..");

              // blobService.createBlockBlobFromStream(container: string, blob: string,
              //  stream: internal.Readable, streamLength: number, callback: azurestorage)
              blobService.createBlockBlobFromStream(
                container,
                "AI_HistPhotoGraph_" +
                  result1.output.Newai_HistPhotoGraphID +
                  fileName, //filename
                fs.createReadStream(filepath),
                data.length,
                function(error, result, response) {
                  if (error) {
                    console.log("Couldn't upload stream");
                    console.error(error);
                  } else {
                    fs.unlink(filepath, function(err) {
                      if (err && err.code == "ENOENT") {
                        // file doens't exist
                        console.info("File doesn't exist, won't remove it.");
                      } else if (err) {
                        // other errors, e.g. maybe we don't have enough permission
                        console.error(
                          "Error occurred while trying to remove file"
                        );
                      } else {
                        console.info(`removed`);
                      }
                    });

                    console.log("Stream uploaded successfully");
                  }
                }
              );
            }
            console.log("uploaded..");
            res.send(result1.output.Newai_HistPhotoGraphID);
          });
        } else {
          console.log(err);
        }
      });
    }
  },
  downloadFile: function(
    req,
    res,
    companyID,
    VesselID,
    tableName,
    histID,
    Origin
  ) {
    GetStorageOption(Origin, companyID, VesselID, tableName, (data, err) => {
      if (data) {
        var strHQ_Storage_Option = data[0].HQ_Storage_Option;
        console.log(
          "strHQ_Storage_Option before call :+ " + strHQ_Storage_Option
        );
        if (strHQ_Storage_Option.toUpperCase() == "database".toUpperCase()) {
          console.log("strHQ_Storage_Option + " + strHQ_Storage_Option);
          downloadFileFromDB(req, res, histID);
        } else if (strHQ_Storage_Option == "Cloud") {
          downloadFileFromAzure(req, res);
        } else {
          console.log("Error while retrieve storage option");
        }
      }
    });

    async function downloadFileFromDB(req, res, histID) {
      try {
        let conn = await mssql.connect(config);
        let result1 = await conn.request()
          .query(`select AI_Hist_PhotographAttachmentsID,Description,FileName,BlobContents 
            from AI_Hist_PhotographAttachments where IsDeleted=0 and AI_HistID = ${histID}`);
        mssql.close();
        //convert buffer data(blobcontents) into base64
        result1.recordset.forEach((element, i) => {
          if (element.BlobContents !== null) {
            result1.recordset[i].BlobContents = Buffer.from(
              element.BlobContents
            ).toString("base64");
          }
        });
        res.send(result1.recordset);
      } catch (err) {
        console.log("err--downloadFileFromDB-->>>>>" + err);
        mssql.close();
      }
    }

    function downloadFileFromAzure(req, res) {
      var blobService = azure.createBlobService(storageAccount, accessKey);

      blobService.createContainerIfNotExists(container, async function(
        error,
        result,
        response
      ) {
        if (!error) {
          var sendImageFiles = [];
          try {
            let conn = await mssql.connect(config);
            let result1 = await conn.request()
              .query(`select AI_Hist_PhotographAttachmentsID,OriginalFileType,Description,FileName,BlobContents 
              from AI_Hist_PhotographAttachments where IsDeleted=0 and AI_HistID = ${histID}`);
            mssql.close();

            await result1.recordset.forEach(item => {
              item.AI_Hist_PhotographAttachmentsID;
              var downloadfilename = "C:/wdir/" + item.FileName;
              var blobName =
                "AI_HistPhotoGraph_" +
                item.AI_Hist_PhotographAttachmentsID +
                item.FileName;

              var Description = item.Description;
              var FileName = item.FileName;
              var AI_Hist_PhotographAttachmentsID =
                item.AI_Hist_PhotographAttachmentsID;
              console.log("downloadfilename", downloadfilename);
              blobService.getBlobToLocalFile(
                container,
                blobName,
                downloadfilename,
                function(error) {
                  if (!error) {
                    var fs = require("fs");
                    fs.readFile(downloadfilename, null, async (err, data) => {
                      try {
                        var blobContents = await Buffer.from(data).toString(
                          "base64"
                        );
                        sendImageFiles.push({
                          AI_Hist_PhotographAttachmentsID: AI_Hist_PhotographAttachmentsID,
                          FileName: FileName,
                          Description: Description,
                          BlobContents: blobContents
                        });
                      } catch (error) {
                        console.log("Error from download file from  azure");
                      }

                      if (err) {
                        return console.log(err);
                      }
                    });
                  }
                }
              );
            });
            setTimeout(() => {
              res.send(sendImageFiles);
            }, 2000);
          } catch (err) {
            // res.sendStatus(403);
            console.log("error => " + err);
          }
        }
      });
    }
  },
  editFile: function(
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
  ) {
    GetStorageOption(Origin, companyID, VesselID, tableName, (data, err) => {
      if (data) {
        var strHQ_Storage_Option = data[0].HQ_Storage_Option;
        console.log(
          "strHQ_Storage_Option before call :+ " + strHQ_Storage_Option
        );
        if (strHQ_Storage_Option.toUpperCase() == "database".toUpperCase()) {
          console.log("strHQ_Storage_Option + " + strHQ_Storage_Option);
          editFileInDB(
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
            fileContent
          );
        } else if (strHQ_Storage_Option == "Cloud") {
          editFileInAzure(
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
            fileContent
          );
        } else {
          console.log("Error while retrieve storage option");
        }
      }
    });

    async function editFileInDB(
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
      fileContent
    ) {
      try {
        let conn = await mssql.connect(config);
        let result1 = await conn
          .request()
          .input(
            "AI_Hist_PhotographAttachmentsID",
            mssql.BigInt,
            aiHistPhotoGraphAttachmentID
          )
          .input("VesselId", mssql.Int, VesselID)
          .input("Description", mssql.VarChar(250), desc)
          .input("FileName", mssql.VarChar(150), fileName)
          .input("FileType", mssql.VarChar(5), fileExtension)
          .input("OriginalFileType", mssql.VarChar(5), fileExtension)
          .input("BlobContents", mssql.Image, fileContent)
          .input("BlobSize", mssql.Int, fileSize)
          .input("OriginalFileSize", mssql.Int, fileSize)
          .input("AddedOn", mssql.DateTime, new Date())
          .input("IsUploaded", mssql.Int, 1)
          .execute("usp_AI_RN_UpdatePhotoGraphToDB");
        mssql.close();
        res.send("ok");
      } catch (err) {
        console.log("err--uploadFileToAzure-->>>>>" + err);
        mssql.close();
      }
    }

    async function editFileInAzure(
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
      fileContent
    ) {
      fs.readFile(newpath, async function(err, data) {
        if (!err) {
          try {
            let conn = await mssql.connect(config);
            let result1 = await conn
              .request()
              .input(
                "AI_Hist_PhotographAttachmentsID",
                mssql.BigInt,
                aiHistPhotoGraphAttachmentID
              )
              .input("VesselId", mssql.Int, VesselID)
              .input("Description", mssql.VarChar(250), desc)
              .input("FileName", mssql.VarChar(150), fileName)
              .input("FileType", mssql.VarChar(5), fileExtension)
              .input("OriginalFileType", mssql.VarChar(5), fileExtension)
              .input("BlobContents", mssql.Image, null)
              .input("BlobSize", mssql.Int, fileSize)
              .input("OriginalFileSize", mssql.Int, fileSize)
              .input("AddedOn", mssql.DateTime, new Date())
              .input("IsUploaded", mssql.Int, 1)
              .execute("usp_AI_RN_UpdatePhotoGraphToDB");
            mssql.close();

            //Creating blob service for read,create ,delete & update files from azure.
            var blobService = azure.createBlobService(
              storageAccount,
              accessKey
            );
            var t = "unable to connect";
            blobService.createContainerIfNotExists(container, function(
              error,
              result,
              response
            ) {
              if (!error) {
                t = "could connec t to conatiner...";
                console.log("Connecting blob..");

                // blobService.createBlockBlobFromStream(container: string, blob: string,
                //  stream: internal.Readable, streamLength: number, callback: azurestorage)
                blobService.createBlockBlobFromStream(
                  container,
                  "AI_HistPhotoGraph_" +
                    aiHistPhotoGraphAttachmentID +
                    fileName, //filename

                  fs.createReadStream(newpath),
                  data.length,
                  function(error, result, response) {
                    if (error) {
                      console.log("Couldn't upload stream");
                      console.error(error);
                    } else {
                      fs.unlink(newpath, function(err) {
                        if (err && err.code == "ENOENT") {
                          // file doens't exist
                          console.info("File doesn't exist, won't remove it.");
                        } else if (err) {
                          // other errors, e.g. maybe we don't have enough permission
                          console.error(
                            "Error occurred while trying to remove file"
                          );
                        } else {
                          console.info(`removed`);
                        }
                      });

                      console.log("Stream uploaded successfully");
                    }
                  }
                );
              }
              console.log("uploaded..");
              res.send(result1.output.Newai_HistPhotoGraphID);
              // res.writeHead(200, { 'content-type': 'text/plain' });
              // res.write('received fields:\n\n ' + util.inspect(fields));
              // res.write('\n\n');
              // res.end('received files:\n\n ' + util.inspect(files));
              // res.sendStatus(200);
            });
          } catch (err) {
            console.log("err--editFileInAzure-->>>>>" + err);
            mssql.close();
          }
        }
      });
    }
  }
};

async function GetStorageOption(Origin, C_CompanyID, VesselID, TableName, cb) {
  // cb --> callback --> (data,err)=>{}
  console.log("currentorigin" + Origin);
  if (Origin.toUpperCase() === "VSL") {
    var data = [{ HQ_Storage_Option: "database" }];
    cb(data);
  } else {
    try {
      let conn = await mssql.connect(config);
      let result1 = await conn
        .request()
        .input("C_CompanyID", mssql.BigInt, C_CompanyID)
        .input("VesselID", mssql.Int, VesselID)
        .input("TableName", mssql.VarChar(120), TableName)
        .execute("usp_AI_RN_GetStorageOption");
      mssql.close();
      let data = result1.recordset;
      cb(data);
    } catch (err) {
      console.log("error From get Storage option=> ..." + err);
    }
  }
}
