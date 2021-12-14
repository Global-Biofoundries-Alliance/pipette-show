import clone from "clone";
import plates from "./PlatesLib.js";
import { findPlate, wellNameToId } from "./PlatesLib.js";
import { GoogleAuth } from "./GoogleAuth.js";
import { calcColor } from './ColorCalculator.js';

//---------------- Import -------------------

function fillValues(values, upTo)
{  
  for(let i = values.length; i < upTo; i++)
  {
    let zeros = [];
    for(let i = 0; i < values[0].length; i++)
    {
      zeros.push(0);
    }

    values.push(zeros);
  }
  console.log('todo: fill values', values, upTo);
  return values;
}

//Imports a project from csv format
function importCSV(content, fname) {
  let Papa = require("papaparse");
  let result = Papa.parse(content);

  if (result.errors.length > 0) throw "Error parsing csv!";

  //Header is included
  if (isNaN(result.data[0][0])) {
    let data = result.data;
    var header = data.shift();

    //Convert header to object
    for (let i = 0; i < header.length; i++) {
      header[i] = { color: calcColor(header[i]), name: header[i] };
    }

    //Convert data to numbers
    data = data.map((row) => row.map((e) => Number(Number(e).toFixed(1))));

    let plate = findPlate(data.length);
    return {
      plate: plate,
      file: {
        values: fillValues(data, plate.wells),
        name: fname,
        substances: header,
      }
    };
  } //Header is missing
  else {
    let data = result.data;

    //Convert data to numbers
    data = data.map((row) => row.map((e) => Number(Number(e).toFixed(1))));

    //Create empty header
    let header = [];
    for (let i = 0; i < data[0].length; i++) {
      header.push({ color: calcColor("Substance "+i), name: "Substance " + i });
    }

    let plate = findPlate(data.length);
    return {
      plate: plate,
      file: {
        values: fillValues(data, plate.wells),
        name: fname,
        substances: header,
      }
    };
  }
}


//Imports a project from xls format
function importXLS(data, fname) {
  let XLSX = require("xlsx");  
  let result = XLSX.read(data, {type: 'array'});

  //Get first sheet
  let sheet = result.Sheets[result.SheetNames[0]];

  //Check for column header
  let columnHeader = false, rowHeader = false;
  if(isNaN(sheet['B1'].v))
  {
    columnHeader = true;
  }

  //Check for row headers
  if(isNaN(sheet['A2'].v))
  {
    rowHeader = true;
  }  

  //----- Find all values -----
  //Go through all rows = wells
  let values = [];
  let y = 1;
  if(columnHeader)
    y = 2;  

  /*eslint-disable-next-line*/
  while(true)
  {        
    //Break when the last substance is reached
    if(sheet['A' + y] === undefined)
      break;

    //Go through all columns = substances
    let substances = [];
    let x = 0;
    if(rowHeader)
      x = 1;  

    /*eslint-disable-next-line*/
    while(true)
    {
      let cellIndex = String.fromCharCode(65 + x) + y;  

      //Break when the last substance is reached
      if(sheet[cellIndex] === undefined)
        break;

      substances.push(sheet[cellIndex].v);      

      x++
    }

    values.push(substances);
    y++;
  }
  
  //---- Find headers -----
  let headers = [];
  if(columnHeader)
  {
    //Fetch headers
    let x = 0;
    if(rowHeader)
      x = 1;
    
    /*eslint-disable-next-line*/
    while(true)
    {
      let colIndex = String.fromCharCode(65 + x);
      
      //Break when the last substance is reached
      if(sheet[colIndex + "1"] === undefined)
        break;
      
      let name = sheet[colIndex + "1"].v;
      headers.push({ color: calcColor(name), name: name });
      x++;   
    }
  }
  else  //Header is missing
  {        
    //Create empty headers    
    for (let i = 0; i < values[0].length; i++) {
      let name = "Substance " + i;
      headers.push({ color: calcColor(name), name: name });
    }    
  } 

  let plate = findPlate(values.length);
  return {
    plate: plate,
    file: {
      values: values,
      name: fname,
      substances: headers,
    }
  };
}

//Imports a project from a DIVA or Opentrons .json-file
function importJSON(contentString, fname) {
  let data = JSON.parse(contentString);

  //Import DIVA-File
  if (data.info !== undefined && data.info.divaSettings !== undefined) {
    return importDivaJSON(data, fname);
  }

  else if(data.designerApplication !== undefined && data.designerApplication.name === "opentrons/protocol-designer") {
    return importOpentronsJSON(data, fname); 
  }
  else {
    alert("Cannot import experiment: The provided file does not seem to be a valid opentrons or DIVA-File.");    
  }
}

//Imports a project from a Opentrons .json-file
function importOpentronsJSON(data, fname) {
  console.log('opentrons-file', data);

  //--- Abort if file is invalid or too complex for pipette-show ---
  if(Object.keys(data.pipettes).length !== 1)
  {
    alert('Cannot import experiment: PipetteShow does not support importing of Opentrons files with multiple pipettes.');    
    return;
  }

  //TODO: Other tests?


  //--- Find substances from labware-definitions ---
  let substances = [];
  let ingIdToSubstance = {};

  for(let i in data.designerApplication.data.ingredients)
  {
    let ingr = data.designerApplication.data.ingredients[i];
    
    ingIdToSubstance[i] = substances.length;    
    substances.push({ name: ingr.name, description: ingr.description, color: calcColor(ingr.name) });    

    //let labwareType = data.labware[dispenseLabware].definitionId;
    //let wells = Object.keys(data.labwareDefinitions[labwareType].wells).length;
  }  


  //substances[0] = { name: normalizationSubstance, color: "#1f78b4" };


  /*Substanz-Namen:
designerApplication.ingredients
und
designerApplication.ingredLocations zum zuordnen*/

  //labwareDefinitions[id].wells.length



  //--- Simplify and validate opentrons-instructions ---
  let aspirated = undefined;
  let dispenseLabware = undefined;
  let simplifiedCommands = [];
  for(let i = 0; i < data.commands.length; i++)
  {
    let entry = data.commands[i];

    switch(entry.command)
    {
      case 'aspirate':
        if(aspirated !== undefined)
        {
          alert('Cannot import experiment: PipetteShow supports only instruction sets where every aspiration is matched by exactly one dispensing operation.');
          return;
        }

        //determine substance
        let sub = data.designerApplication.data.ingredLocations[entry.params.labware][entry.params.well];
        if(Object.keys(sub).length > 1)
        {
          alert('Cannot import experiment: PipetteShow does not support source wells with multiple substances.');
          return;
        }

        let ingredientId = Object.keys(sub)[0]
        let substanceIndex = ingIdToSubstance[ingredientId];

        aspirated = {substance: substanceIndex, volume: entry.params.volume};
      break;

      case 'dispense':
        //First instruction: Set dispense-labware (later used to determine the plate-type)
        if(dispenseLabware === undefined)
        {
          dispenseLabware = entry.params.labware;
        }
        //Following instructions: Give an error if multiple dispensing-labwares are used!
        else if(dispenseLabware !== entry.params.labware)
        {
          alert('Cannot import experiment: PipetteShow does not support dispensing into multiple labwares.');
          return; 
        }

        //Check if dispensed volume matches aspirated volume
        if(entry.params.volume !== aspirated.volume)
        {
          alert('Cannot import experiment: PipetteShow does not support dispensing a different volume than aspirated.');
          return;  
        }

        //Add to simplified commands
        aspirated.well = entry.params.well;
        simplifiedCommands.push(aspirated);
        aspirated = undefined;
      break;

      default:
        //console.log('other command', entry.command);
      break;
    }
  }


  //--- Find plate-type from dispense-labware ---
  let labwareType = data.labware[dispenseLabware].definitionId;
  let wells = Object.keys(data.labwareDefinitions[labwareType].wells).length;
  let plate = findPlate(wells);    

  //--- Use simplified instructions to calculate well contents ---

  console.log('simplified commands', simplifiedCommands);
  
  //Initialize empty values array
  let values = [];
  for(let w = 0; w < plate.wells; w++)
  {
    values[w] = [];
    for(let s = 0; s < substances.length; s++)
    {
      values[w][s] = 0;
    }
  }

  //Go through all simplified instructions and add their amount to the wells-array
  for(let i = 0; i < simplifiedCommands.length; i++)
  {
    let command = simplifiedCommands[i];
    let wellId = wellNameToId(plate, command.well);
    values[wellId][command.substance] = command.volume;    
  }  

  console.log('values', values);

  
  return {
    plate: plate,
    file: {
      values: values,
      name: data.metadata.protocolName,
      substances: substances,
    }
  };
}

//Imports a project from a DIVA .json-file
function importDivaJSON(data, fname) {  

  //--- Abort if file is no valid DIVA-output ---
  if (data.info === undefined) {
    alert("Cannot import experiment. Is it a valid DIVA-File?");
    return;
  }  

  //TODO: More sophisticated checks??

  //--- Find Normalization-Volume and -Substance as well as target-plate information ---
  let normalizationSubstance = data.targetPlate.normalization;
  let normalizationVolume = data.targetPlate.assayVolume;
  let wellCount = data.targetPlate.rows * data.targetPlate.cols;
  let plateName = data.targetPlate.name;

  let plate = plates[plateName];

  if (plate === undefined) {
    alert(
      'Cannot import experiment with unknown plate type: "' + plateName + '".'
    );
    return;
  }

  if (wellCount !== plate.wells) {
    alert(
      'Cannot import experiment with plate type "' +
        plateName +
        '". Expected to find ' +
        plate.wells +
        " wells but found " +
        wellCount +
        "."
    );
    return;
  }

  //--- Find ALL substances ---
  let steps = data.dispensingSteps;

  let substances = [];
  let indexMap = {};
  let substanceCount = 1;
  for (let i = 0; i < steps.length; i++) {
    let step = steps[i];
    let identifier = step.sourceWell;

    //Save normalization-Substance
    if (step.liquidName === normalizationSubstance) {
      indexMap[identifier] = 0;
      substances[0] = { name: step.liquidName, color: "#1f78b4" };
    }

    //Save normal substance
    if (indexMap[identifier] === undefined) {
      indexMap[identifier] = substanceCount;
      substances[substanceCount] = {
        name: step.liquidName,
        color: calcColor(step.liquidName),
      };

      substanceCount++;
    }
  }

  //Add normalization-substance if not yet present
  if (substances[0] === undefined) {
    substances[0] = { name: normalizationSubstance, color: "#1f78b4" };
  }

  //--- Create empty values-array  ---
  let values = [];
  for (let w = 0; w < wellCount; w++) {
    let row = [];
    Object.keys(substances).forEach(() => {
      row.push(0);
    });
    values.push(row);
  }

  //--- Fill values-array  ---
  for (let i = 0; i < steps.length; i++) {
    let step = steps[i];
    let identifier = step.sourceWell;

    let substanceId = indexMap[identifier];
    let targetWell = wellNameToId(plate, step.targetWell);

    values[targetWell][substanceId] = Number(step.volume.toFixed(1));
  }

  //--- Fill first Substance up to assay volume ---
  for (let w = 0; w < values.length; w++) {
    let well = values[w];
    let wellSum = 0;
    for (let s = 1; s < well.length; s++) {
      wellSum += values[w][s];
    }

    //Don't fill the value with buffer substance if it stays completly empty
    if (wellSum > 0)
      values[w][0] = (normalizationVolume - wellSum).toFixed(1) * 1;
  }

  let filledValues = fillValues(values, plate.wells);
  console.log('diva-values', filledValues);
  
  return {
    plate: plate,
    file: {
      values: filledValues,
      name: fname,
      substances: substances,
    }
  };
}


function rawFileUploaded($store, file, target, afterLoaded) {
  target = target ?? "build";  
  var reader = new FileReader();

  if(file.name.endsWith('xls') || file.name.endsWith('xlsx'))
  {

    reader.onload = function(e) {
      var data = new Uint8Array(e.target.result);
      binaryFileUploaded($store, file.name, data, target);

      if (afterLoaded !== undefined)
        afterLoaded();      
    };

    reader.readAsArrayBuffer(file);      
  }
  else
  {    
    reader.onload = function (evt) {
      stringFileUploaded($store, file.name, evt.target.result, target);

      if (afterLoaded !== undefined)
        afterLoaded();
    };

    reader.readAsText(file, "UTF-8");
  }  
}

function binaryFileUploaded($store, fname, data, target) {
  
  if (fname.endsWith(".xls") || fname.endsWith(".xlsx")) 
  {
      if (target !== "build") 
      {
        console.error("XLS(X)-Import is not allowed in Show-Module!");
        return;
      }

      let results = importXLS(data, fname);      

      if (results === undefined) return;

      $store.commit("build/changePlate", {
        plate: results.plate,
        silent: true,
      });
      $store.commit("build/setFileContent", results.file);
    }   
}

function stringFileUploaded($store, fname, content, target) {  

  try {
    if (fname.endsWith(".pip")) {
      content = JSON.parse(content);

      if (target === "build") {
        $store.commit('build/changePlate', {plate: plates[content.plate],
        silent: true});

        $store.commit('build/setInstructionsMode', content.instructionsmode);
        $store.commit('build/setMultiChannelPipette', content.multichannelpipette);

        $store.commit("build/setFileContent", {
          name: content.name,
          substances: content.substances,
          values: content.values,
          //Don't import instructions -> They are freshly generated before export!
        });
      } else {
        $store.commit("show/loadInstructions", {
          file: {
            instructions: content.instructions,
            substances: content.substances,
            name: content.name,
            //Don't import values -> They are not relevant!
          },

          plate: plates[content.plate],
        });
      }
    } else if (fname.endsWith(".csv")) {
      if (target !== "build") {
        console.error("CSV-Import is not allowed in Show-Module!");
        return;
      }

      let results = importCSV(content, fname);

      if (results === undefined) return;

      $store.commit("build/changePlate", {
        plate: results.plate,
        silent: true,
      });
      $store.commit("build/setFileContent", results.file);
    } else if (fname.endsWith(".json")) {
      if (target !== "build") {
        console.error("JSON-Import is not allowed in Show-Module!");
        return;
      }

      let results = importJSON(content, fname);

      if (results === undefined) return;

      $store.commit("build/changePlate", {
        plate: results.plate,
        silent: true,
      });
      $store.commit("build/setFileContent", results.file);
    } else {
      throw "File-Type not supported!";
    }
  } catch (ex) {
    alert("The uploaded file seems to be corrupted and cannot be parsed.");
    $store.commit("build/createNewfile");
    return(false);
  }
  return(true);
}

/* global google */
async function pickGoogleDriveFile($store, target, afterLoaded) {
  var response = await GoogleAuth();

  if (response && !response.error) {
    let oauthToken = response.access_token;

    var view = new google.picker.DocsView(google.picker.ViewId.DOCS);
    view.setMimeTypes("application/octet-stream");
    view.setQuery("*.pip");

    let myStore = $store;
    var picker = new google.picker.PickerBuilder()
      .setAppId(process.env.VUE_APP_ID)
      .setDeveloperKey(process.env.VUE_APP_API_KEY)
      .setOAuthToken(oauthToken)

      .enableFeature(google.picker.Feature.NAV_HIDDEN)
      .addView(view)
      //.addView(new google.picker.DocsUploadView())
      .setCallback((val) => pickerCallback(myStore, oauthToken, val, target, afterLoaded))
      .build();
    picker.setVisible(true);
  }
}

async function pickerCallback($store, oauthToken, val, target, afterLoaded) {
  if (val.action == "picked") {    
    getGoogleDriveFile($store, oauthToken, val.docs[0].id, val.docs[0].name, target, afterLoaded);
  }
}

/* global gapi */
async function getGoogleDriveFile($store, oAuthToken, fileId, name, target, afterLoaded) {      
  
  //Connect to Google Drive if not yet connected
  if(oAuthToken === undefined)
  {
    console.log('Connecting to Google Drive...');
    var response = await GoogleAuth();

    if (response && !response.error) {
      oAuthToken = response.access_token;
    }
    else
    {
      console.error("Error connecting to google drive", response);
      return;
    }
  }


  //console.log("Using oAuthToken", oAuthToken);


  //Retrieve filename if not yet known
  if(name === undefined)
  {
    let command = gapi.client.drive.files.get({
      fileId: fileId,
    });

    await new Promise((resolve) => {
      command.execute(function (metaData) {
        //console.log('file-metadata', metaData);
        name = metaData.name;        
        resolve();
      });
    });
  }


  let command = gapi.client.drive.files.get({
    fileId: fileId,
    alt: "media", //request content instead of metadata
  });
  console.log("before stringFile. Name: ", name, "FileID: ", fileId)
  command.execute(function (fileContent) {
    //Load instructions
    let success = stringFileUploaded($store, name, JSON.stringify(fileContent), target);
    
    //Go to next Step
    if (afterLoaded !== undefined && success)
      afterLoaded(fileId);
  });  
}

//---------------------- Export --------------------

function makeExportContent($store, format) {
  //Gather file-content and instructions
  var fileContent = clone($store.state.build.file);
  let lib = require("../lib/InstructionsLib.js");
  fileContent.instructions = lib.flattenedInstructions($store);
  fileContent.plate = $store.state.build.plate.name;
  fileContent.instructionsmode = $store.state.build.instructionsmode;
  fileContent.multichannelpipette = $store.state.build.multichannelpipette;

  //Convert file content to string and retrieve filename
  var content = JSON.stringify(fileContent);
  var filename = $store.state.build.file.name + ".pip";

  //Convert to CSV if requested
  if (format === "csv") {
    let Papa = require("papaparse");

    let substanceNames = [];
    for (let i = 0; i < $store.state.build.file.substances.length; i++) {
      substanceNames[i] = $store.state.build.file.substances[i].name;
    }

    content = Papa.unparse(
      [substanceNames].concat($store.state.build.file.values)
    );
    filename = $store.state.build.file.name + ".csv";
  }

  return { content: content, filename: filename };
}

function downloadFile($store, format) {
  let exp = makeExportContent($store, format);

  //Initiate download
  var element = document.createElement("a");
  element.setAttribute(
    "href",
    "data:text/plain;charset=utf-8," + encodeURIComponent(exp.content)
  );
  element.setAttribute("download", exp.filename);

  element.style.display = "none";
  document.body.appendChild(element);

  element.click();
  document.body.removeChild(element);
}

async function saveToGoogleDrive($store, $eventbus, folderOrFileId, updateExistingFile) {
  var response = await GoogleAuth();

  if (response && !response.error) {
    var oauthToken = response.access_token;
    let exp = makeExportContent($store, "pip");

    // Pack content into blob
    var contentBlob = new Blob([exp.content], { type: "application/octet-stream" });       

    //Send XHR-Request to update/create the file
    var xhr = new XMLHttpRequest();
    let sendData;
    if(updateExistingFile)
    {
      xhr.open('PATCH', 'https://www.googleapis.com/upload/drive/v3/files/' + folderOrFileId + '?uploadType=media');      
      sendData = contentBlob;
    }
    else
    {

      var metadata = {
        name: exp.filename, // Filename at Google Drive
        mimeType: "application/octet-stream", // mimeType at Google Drive      
      };

      if(folderOrFileId !== undefined)
      {
        metadata.parents = [folderOrFileId];
      }

      sendData = new FormData();
      sendData.append(
        "metadata",
        new Blob([JSON.stringify(metadata)], { type: "application/json" })
      );
      sendData.append("file", contentBlob);

      xhr.open(
        "post",
        "https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&fields=id"
      );  
    }


    xhr.setRequestHeader("Authorization", "Bearer " + oauthToken);
    xhr.responseType = "json";
    xhr.onload = function () {                

      if(!updateExistingFile)
        $eventbus.emit("show-dialog", { dialog: "drive-saved", folder: folderOrFileId });
      else
        $eventbus.emit("show-dialog", { dialog: "drive-saved"});
    };

    xhr.send(sendData);
  }
}

async function getTransferCode($store, $eventbus) {
  let makeTransferCode = require("./TransferCodeLib.js").makeTransferCode;
  let exp = makeExportContent($store, "pip");

  let res = await makeTransferCode(exp.filename, exp.content);

  if (res !== false) {
    $eventbus.emit("show-dialog", {
      dialog: "transfer-code",
      img: res.img,
      code: res.code,
    });
  }
}

export {
  makeExportContent,
  downloadFile,
  rawFileUploaded,
  pickGoogleDriveFile,
  saveToGoogleDrive,
  getTransferCode,
  getGoogleDriveFile,
  stringFileUploaded
};
