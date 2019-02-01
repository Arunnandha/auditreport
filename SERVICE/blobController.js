var mssql = require("mssql");
var azure = require("azure-storage");
var fs = require("fs");
var config = {
  user: "sa",
  password: "crux",
  port: 1433,
  server: "WIN2012SVR\\DEVUSER4",
  database: "nVSLSDS_PACC_DREM",
  options: {
    encrypt: true
  }
};
module.exports = {
  uploadFile: (
    req,
    res,
    desc,
    fileName,
    fileExtension,
    fileContent,
    fileSize,
    companyID,
    tableName,
    vesselID,
    filepath
  ) => {
    GetStorageOption(companyID, vesselID, tableName, (data, err) => {
      if (data) {
        var strHQ_Storage_Option = data[0].HQ_Storage_Option;
        console.log(
          "strHQ_Storage_Option before call :+ " + strHQ_Storage_Option
        );
        // if (
        //   strHQ_Storage_Option.toUpperCase() ==
        //   StorageType_DATABASE.toUpperCase()
        // ) {
        //   console.log("strHQ_Storage_Option + " + strHQ_Storage_Option);
        // uploadFileToDB(
        //   req,
        //   res,
        //   desc,
        //   fileName,
        //   fileExtension,
        //   fileContent,
        //   fileSize
        // );
        //     } else if (strHQ_Storage_Option == "Cloud") {

        uploadFileToAzure(
          req,
          res,
          desc,
          fileName,
          fileExtension,
          fileContent,
          fileSize,
          filepath
        );

        //     }
        //   } else {
        //     console.log("Error while retrieve storage option");
        //   }
      }
    });

    var uploadFileToDB = async (
      req,
      res,
      desc,
      fileName,
      fileExtension,
      fileContent,
      fileSize
    ) => {
      var AI_HistPhotoGraphID = 0;
      try {
        let pool = await mssql.connect(config);
        let result1 = await pool
          .request()
          .input("Origin", mssql.VarChar(50), "VSL")
          .input("VesselId", mssql.Int, 905)
          .input("AI_HistID", mssql.BigInt, 60)
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
          .execute("usp_ai_UploadPhotoGraphToDB");

        mssql.close();
        res.send(result1.output.Newai_HistPhotoGraphID);
      } catch (err) {
        console.log("err---->>>>>" + err);
        mssql.close();
      }
    };

    //uploadFileToAzure
    var uploadFileToAzure = (
      req,
      res,
      desc,
      fileName,
      fileExtension,
      fileContent,
      fileSize,
      filepath
    ) => {
      //Paste Azure detsipss
      var AI_HistPhotoGraphID = 0;
      var result1;
      console.log("file path", filepath);
      fs.readFile(filepath, async function(err, data) {
        if (!err) {
          try {
            let pool = await mssql.connect(config);
            result1 = await pool
              .request()
              .input("Origin", mssql.VarChar(50), "VSL")
              .input("VesselId", mssql.Int, 905)
              .input("AI_HistID", mssql.BigInt, 60)
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
              .input("HQ_Storage_Option", mssql.VarChar(50), "")
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
              .execute("usp_ai_UploadPhotoGraphToDB");
            console.log("newly inserted value ", AI_HistPhotoGraphID);

            mssql.close();
            console.log("result db -->", result1);
          } catch (err) {
            console.log("err---->>>>>" + err);
            mssql.close();
          }

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
              blobService.createBlockBlobFromStream(
                container,
                "AI_HistPhotoGraph" +
                  result1.output.Newai_HistPhotoGraphID +
                  "." +
                  fileExtension, //filename
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
            // res.writeHead(200, { 'content-type': 'text/plain' });
            // res.write('received fields:\n\n ' + util.inspect(fields));
            // res.write('\n\n');
            // res.end('received files:\n\n ' + util.inspect(files));
            // res.sendStatus(200);
          });
        } else {
          console.log(err);
        }
      });
    };
    // GetStorageOption
  }
};

var GetStorageOption = async (C_CompanyID, VesselID, TableName, cb) => {
  try {
    let pool = await mssql.connect(config);
    let result1 = await pool
      .request()
      .input("C_CompanyID", mssql.BigInt, C_CompanyID)
      .input("VesselID", mssql.Int, VesselID)
      .input("TableName", mssql.VarChar(120), TableName)
      .execute("ai_GetStorageOption");
    mssql.close();
    cb(result1.recordset);
  } catch (err) {
    console.log("error => ..." + err);
  }
};
