import clone from "clone";
import plates from "../lib/PlatesLib.js";

const showModule = {
  namespaced: true,
  state: {
    platePosition: {
      left: 0,
      top: 0,
      bottom: 0,
      right: 0,
    },

    file: {},

    plate: plates["MWP 24"],

    settingsOpened: false,
    currentInstructionIndex: 0,

    //Resetted at page mount:
    shownDialog: "none",
    resizing: false,
    lastPlatePosition: undefined,
    rightHand: true,

    recentFiles: [],
  },

  mutations: {
    setPlatePosition(state, position) {
      state.platePosition = clone(position);
    },

    loadInstructions(state, options) {
      state.file = options.file;
      state.plate = options.plate;

      state.currentInstructionIndex = 0;
      state.shownDialog = "none";


      //---- Add file to recentFiles -----
      let infos = {file: options.file, plate: options.plate.name, date: Date.now()};

      let results = [infos];
      for(let i = 0; i < state.recentFiles.length; i++)
      {
        if(state.recentFiles[i].file.name !== options.file.name)
        {
          results.push(state.recentFiles[i]);
        }

        if(results.length === 5)
          break;
      }
      state.recentFiles = results;

      console.log('loaded new file', options);
      //TODO: add as most recent last file. Remove any older entry in lastFiles. If more than 10 lastFiles are present, remove the oldest.
      //state.lastFiles[options.file.name] = {file: options.file, plate: options.plate.id};
    },

    toggleSettings(state, open) {
      state.settingsOpened = open;
    },

    setRightHand(state, useRightHand) {
      state.rightHand = useRightHand;
    },

    nextInstruction(state) {
      if (state.currentInstructionIndex < state.file.instructions.length - 1)
        state.currentInstructionIndex++;
    },

    lastInstruction(state) {
      if (state.currentInstructionIndex > 0) state.currentInstructionIndex--;
    },

    abortPipetting(state) {
      state.file = {};
      state.currentInstructionIndex = 0;
      state.shownDialog = "load-file";
    },

    finishPipetting(state) {
      state.currentInstructionIndex = 0;
      state.shownDialog = "finished";
    },

    openDialog: function (state, dialog) {
      state.shownDialog = dialog;
    },

    startResizing: function (state) {
      state.resizing = true;
      state.lastPlatePosition = clone(state.platePosition);
    },

    stopResizing: function (state) {
      state.resizing = false;
      state.lastPlatePosition = undefined;
    },

    abortResizing: function (state) {
      state.resizing = false;
      state.platePosition = state.lastPlatePosition;
      state.lastPlatePosition = undefined;
    },
  },

  getters: {
    instructionsLoaded: function (state) {
      return (
        state.file.instructions !== undefined &&
        state.file.instructions.length > 0
      );
    },

    pipettingStarted: function (state) {
      return state.currentInstructionIndex > 0;
    },

    currentInstruction: function (state, getters) {
      if (!getters.instructionsLoaded) return undefined;

      return state.file.instructions[state.currentInstructionIndex];
    },

    currentWell: function (state, getters) {
      if (!getters.instructionsLoaded) return -1;

      if (getters.currentInstruction === undefined) return -1;

      return getters.currentInstruction.well;
    },

    currentSubstance: function (state, getters) {
      if (!getters.instructionsLoaded) return undefined;

      return state.file.substances[getters.currentInstruction.substance];
    },

    instructionCount: function (state, getters) {
      if (!getters.instructionsLoaded) return 0;

      return state.file.instructions.length;
    },

    hasNextInstruction: function (state, getters) {
      if (!getters.instructionsLoaded) return false;

      return state.file.instructions.length - 1 > state.currentInstructionIndex;
    },

    hasLastInstruction: function (state, getters) {
      if (!getters.instructionsLoaded) return false;

      return state.currentInstructionIndex > 0;
    },
  },

  actions: {
    pageMount(context) {
      context.commit("stopResizing");

      if (context.getters.instructionsLoaded) {
        context.commit("openDialog", "continue");
      } else {
        context.commit("openDialog", "load-file");
      }
    },

    abortDialog(context) {
      if (context.getters.instructionsLoaded) {
        context.commit("openDialog", "none");
      } else {
        context.commit("openDialog", "load-file");
      }
    }
  },
};

export default showModule;
