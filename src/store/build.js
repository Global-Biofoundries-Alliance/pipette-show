import clone from "clone";
import plates from "../lib/PlatesLib.js";

function getDefaultName(defaultString) {
  if(defaultString === undefined)
    defaultString = 'New_Project';

  let date = new Date();
  let month = String(date.getMonth() + 1);
  if (month.length === 1) month = "0" + month;

  let day = String(date.getDate());
  if (day.length === 1) day = "0" + day;

  let hour = String(date.getHours());
  if (hour.length === 1) hour = "0" + hour;

  let minute = String(date.getMinutes());
  if (minute.length === 1) minute = "0" + minute;

  let second = String(date.getSeconds());
  if (second.length === 1) second = "0" + second;
  return (
    date.getFullYear() +
    month +
    day +
    "_" +
    hour +
    minute +
    second +
    '_' +
    defaultString
  );
}

const buildModule = {
  namespaced: true,
  state: {
    plate: plates["MWP 24"],
    instructionsmode: 2,
    multichannelpipette: 0, 

    hideInstallToDriveDialog: false,

    file: {
      substances: [
        { name: "Water", color: "#6699ff", computedColor: true },
        { name: "Sample 1", color: "#66ff33", computedColor: true },
      ],

      name: getDefaultName(),

      values: [
        [0, 0],
        [0, 0],
        [0, 0],
        [0, 0],
        [0, 0],
        [0, 0],
        [0, 0],
        [0, 0],
        [0, 0],
        [0, 0],
        [0, 0],
        [0, 0],
        [0, 0],
        [0, 0],
        [0, 0],
        [0, 0],
        [0, 0],
        [0, 0],
        [0, 0],
        [0, 0],
        [0, 0],
        [0, 0],
        [0, 0],
        [0, 0],
      ],
    },
  },

  mutations: {
    setInstructionsMode(state, options)
    {
      state.instructionsmode = options;
            
      if(options < 3)
        state.multichannelpipette = 0;
    },

    hideInstallToDriveDialog(state)
    {
      state.hideInstallToDriveDialog = true;
    },

    setMultiChannelPipette(state, options)
    {      
      state.multichannelpipette = options;
    },

    // --- Change plate ----
    changePlate(state, options) {
      let plate = options.plate;

      if (!options.silent && plate.wells < state.file.values.length) {
        if (
          !confirm(
            "This plate contains fewer wells than the currently selected plate.\r\nAll data for non-existing wells will be lost.\r\nContinue?"
          )
        )
          return;
      }
      state.plate = plate;

      //Update values
      if (plate.wells < state.file.values.length) {
        //Remove obsolete wells:
        state.file.values.splice(plate.wells);
      } else if (plate.wells > state.file.values.length) {
        //Add additional wells:

        //Calculate the empty row
        let emptyRow = [];
        for (let i = 0; i < state.file.substances.length; i++) {
          emptyRow.push(0);
        }

        //Insert empty rows to fill up to the desired well count
        var initialLength = state.file.values.length;
        for (let i = 0; i < plate.wells - initialLength; i++) {
          state.file.values.push(clone(emptyRow));
        }
      }
    },

    //--- File-Properties ---

    setFileName(state, name) {
      state.file.name = name;
    },

    //---- Change substances ----

    addSubstance(state, substance) {
      state.file.substances.push(substance);

      for (var i = 0; i < state.file.values.length; i++) {
        state.file.values[i].push(0);
      }
    },

    updateSubstance(state, options) {
      state.file.substances[options.index] = options.value;
    },

    removeSubstance(state, index) {
      state.file.substances.splice(index, 1);

      for (var i = 0; i < state.file.values.length; i++) {
        state.file.values[i].splice(index, 1);
      }
    },

    setResortedSubstances(state, options) {
      state.file.substances = options.substances;
      state.file.values = options.values;

      //TODO: Resort values!!
    },

    //---- Change values -------

    updateValue(state, change) {
     if (change[3] == "") {
        change[3] = 0;
    }
     if(!isNaN(change[3]) ){
      state.file.values[change[0]][change[1]] = Number(change[3].toFixed(1));
       }
    },

    setValues(state, values) {
      state.file.values = values;
    },

    //---- Change whole file at once ------

    createNewfile(state, options) {
      //Get desired filename
      let name;
      if(options !== undefined && options.name !== undefined)
        name = getDefaultName(options.name);
      else
        name = getDefaultName();

      //Insert empty rows to fill up to the desired well count
      state.plate =  plates["MWP 24"];
      var values = [];
      for (let i = 0; i < state.plate.wells; i++) {
        values.push([0, 0]);
      }

      state.file = {
        substances: [
          { name: "Water", color: "#6699ff" },
          { name: "Sample 1", color: "#66ff33" },
        ],

        name: name,
        values: values,
      };
    },

    setFileContent(state, content) {
      state.file = content;      
    }
  },
  actions: {},
  modules: {},
};

export default buildModule;
