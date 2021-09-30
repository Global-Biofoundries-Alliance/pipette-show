import QRCode from "qrcode";
import axios from "axios";

import plates from "./PlatesLib.js";

let serverAdress = "https://pipette-show.de/";
let linkAdress = serverAdress + "show/";

async function makeTransferCode(projectName, content) {
  //TODO: Change web adress
  var result = await axios.post(serverAdress + "service", {
    method: "save",
    filename: projectName,
    content: content,
  });

  if (result.status !== 200 || result.data.state !== 1) {
    alert("Error creating transfer code.");
    return false;
  }

  let img = await QRCode.toDataURL(linkAdress + result.data.code, {
    errorCorrectionLevel: "H",
  });

  return { img: img, code: linkAdress + result.data.code };
}

function validateTransferCodeLink(link) {
  if (link.startsWith(linkAdress)) return link.substr(linkAdress.length);

  return false;
}

async function resolveTransferCode(code) {
  var result = await axios.post(serverAdress + "service", {
    method: "load",
    code: code,
  });

  if (result.status !== 200 || result.data.state !== 1) {
    return false;
  }

  try {
    let json = JSON.parse(result.data.content);
    return json;
  } catch (_) {
    return false;
  }
}

async function finishScanning($store, link) {
  if (link === undefined || link === null || link === "") {
    $store.commit("show/openDialog", "qrcode-error");
    return;
  }

  let code = validateTransferCodeLink(link);

  if (code === false) {
    $store.commit("show/openDialog", "qrcode-error");
    return;
  }

  let fileContent = await resolveTransferCode(code);
  if (fileContent === false) {
    $store.commit("show/openDialog", "qrcode-error");
    return;
  }

  $store.commit("show/loadInstructions", {
    file: {
      instructions: fileContent.instructions,
      substances: fileContent.substances,
      name: fileContent.name,
    },

    plate: plates[fileContent.plate],
  });
}

export {
  makeTransferCode,
  validateTransferCodeLink,
  resolveTransferCode,
  finishScanning,
  linkAdress,
};
