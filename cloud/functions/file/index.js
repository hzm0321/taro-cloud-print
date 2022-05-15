// 云函数入口文件
const cloud = require("wx-server-sdk");
const pdfreader = require("pdfreader");
const fs = require("fs");
// const JSZip = require("jszip");
// const cheerio = require("cheerio");
const toPdf = require("custom-soffice-to-pdf");
// var converter = require("office-converter")();
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV });

// 云函数入口函数
exports.main = async (event, context) => {
  const logger = cloud.logger();

  // 文件的 ArrayBuffer 数据流
  const {
    fileBuffer,
    fileName,
    fileType,
    fileTime,
    fileId,
    userInfo: { openId } = {},
  } = event;
  const type = fileName.replace(/.+\./, "") + "";

  let pageSize = 0;
  let isSuccess = false;

  // 如果有 fileBuffer 直接解析, 如果传 fileId,需要从云存储下载后解析
  if (fileBuffer) {
    if (["docx", "doc"].includes(type)) {
      try {
        const pdfBuffer = await toPdf(fileBuffer);
        const pdf = await readPdfLines(pdfBuffer);
        const lines = await JSON.parse(JSON.stringify(pdf));
        pageSize = lines.length;
        isSuccess = true;
      } catch (err) {
        logger.error({
          err: err,
        });
        isSuccess = false;
      }
      // try {
      //   const result = await cloud.getTempFileURL({
      //     fileList: [fileID]
      //   });
      //   if (result.status === 0) {
      //     const url = result.tempFileURL;
      //     await downloadFile(url, __dirname, "11.docx");
      //     console.log(result);
      //   }
      // } catch (err) {
      //   console.error("错误", err);
      //   isSuccess = false;
      // }
    } else {
      try {
        const pdf = await readPdfLines(fileBuffer.data);
        const lines = await JSON.parse(JSON.stringify(pdf));
        pageSize = lines.length;
        isSuccess = true;
      } catch (err) {
        logger.error({
          err: err,
        });
        isSuccess = false;
      }
    }
  } else if (fileId) {
    const res = await cloud.downloadFile({
      fileID: fileId,
    });
    const buffer = res.fileContent;
    try {
      const pdf = await readPdfLines(buffer);
      const lines = await JSON.parse(JSON.stringify(pdf));
      pageSize = lines.length;
      return {
        success: true,
        data: {
          fileId,
          pageSize,
        },
      };
    } catch (err) {
      logger.error({
        err: err,
      });
      return {
        success: false,
        msg: "程序出现错误",
      };
    }
  }

  // 如果文件解析成功,开始上传文件
  if (isSuccess) {
    try {
      const cloudPath = `printFile/${getTimeInfo()}/${openId}/${fileType}/${fileTime}-${fileName}`;
      const res = await cloud.uploadFile({
        cloudPath: cloudPath,
        fileContent: new Buffer(fileBuffer),
      });
      return {
        success: true,
        data: {
          fileId: res.fileID,
          pageSize,
        },
      };
    } catch (err) {
      logger.error({
        err: err,
      });
    }
  } else {
    return {
      success: false,
      msg: "程序出现错误",
    };
  }

  // toPdf(wordBuffer).then(
  //   (pdfBuffer) => {
  //     fs.writeFileSync("./test.pdf", pdfBuffer)
  //   }, (err) => {
  //     console.log(err)
  //   }
  // )

  function getTimeInfo() {
    const date = new Date();
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    return `${year}-${month}`;
  }

  async function downloadFile(url, filepath, name) {
    if (!fs.existsSync(filepath)) {
      fs.mkdirSync(filepath);
    }
    const mypath = path.resolve(filepath, name);
    const writer = fs.createWriteStream(mypath);
    const response = await Axios({
      url,
      method: "GET",
      responseType: "stream",
    });
    response.data.pipe(writer);
    return new Promise((resolve, reject) => {
      writer.on("finish", resolve);
      writer.on("error", reject);
    });
  }

  async function readPdfLines(buffer, xwidth) {
    return new Promise((resolve, reject) => {
      var pdftxt = [];
      var pg = 0;
      new pdfreader.PdfReader().parseBuffer(buffer, function (err, item) {
        if (err) console.log("pdf reader error: " + err);
        else if (!item) {
          pdftxt.forEach(function (a, idx) {
            pdftxt[idx].forEach(function (v, i) {
              pdftxt[idx][i].splice(1, 2);
            });
          });
          resolve(pdftxt);
        } else if (item && item.page) {
          pg = item.page - 1;
          pdftxt[pg] = [];
        } else if (item.text) {
          var t = 0;
          var sp = "";
          pdftxt[pg].forEach(function (val, idx) {
            if (val[1] == item.y) {
              if (xwidth && item.x - val[2] > xwidth) {
                sp += " ";
              } else {
                sp = "";
              }
              pdftxt[pg][idx][0] += sp + item.text;
              t = 1;
            }
          });
          if (t == 0) {
            pdftxt[pg].push([item.text, item.y, item.x]);
          }
        }
      });
    });
  }

  return {
    success: isSuccess,
    data: {
      pageSize,
    },
  };
};
