<template>
  <div id="select-file-dialog">
    <p>Select file source:</p>

    <div class="dialog-button-holder">
      <vibration-button
        class="upload-method-button"
        @click="openDialog('select-transfer-code-method')"
        ><font-awesome-icon icon="qrcode" />Transfer Code</vibration-button
      >
      <vibration-button
        class="upload-method-button"
        @click="pickGoogleDriveFile"
        ><font-awesome-icon :icon="['fab', 'google-drive']" />Google
        Drive</vibration-button
      >
      <vibration-button
        class="upload-method-button"
        @click="$refs.uploader.show('.pip')"
        ><font-awesome-icon icon="cloud-upload-alt" />Upload
        *.pip-File</vibration-button
      >
      <vibration-button
        v-if="$store.state.show.recentFiles.length > 0"
        class="upload-method-button"
        @click="openDialog('show-recent-experiments')"
        ><font-awesome-icon icon="clock" />Reload recent experiment</vibration-button
      >
      <vibration-button
        class="upload-method-button"
        @click="openSampleFile"
        ><font-awesome-icon icon="file-code" />Open Sample File</vibration-button
      >
    </div>

    <hidden-file-uploader ref="uploader" target="show" />
  </div>
</template>

<script>
import plates from "../../../lib/PlatesLib.js";
import { pickGoogleDriveFile, stringFileUploaded } from "../../../lib/IOLib.js";

import VibrationButton from "../VibrationButton.vue";
import HiddenFileUploader from "../../common/HiddenFileUploader.vue";

import samplefile1 from '!raw-loader!../../Example_Project.pip';


import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";


export default {
  name: "select-file-dialog",
  components: { VibrationButton, FontAwesomeIcon, HiddenFileUploader },

  data() {
    return { method: undefined };
  },

  methods: {
    openDialog: function (dialog) {
      this.$store.commit("show/openDialog", dialog);
    },

    pickGoogleDriveFile: function () {
      pickGoogleDriveFile(this.$store, 'show');
    },

    openSampleFile: function () {
      stringFileUploaded(this.$store, 'Example_Project.pip', samplefile1, 'show');
     
    },

    parseInstructionsFile: function () {
      var file = this.$refs["uploader"].files[0];
      var thi = this;
      if (file) {
        var reader = new FileReader();
        reader.readAsText(file, "UTF-8");
        reader.onload = function (evt) {
          let fileContent = JSON.parse(evt.target.result);
          thi.$store.commit("show/loadInstructions", {
            file: {
              instructions: fileContent.instructions,
              substances: fileContent.substances,
              name: fileContent.name,
            },

            plate: plates[fileContent.plate],
          });

          //thi.$emit("instructionsLoaded"); //unnecessary??
        };

        reader.onerror = function () {
          alert("Error parsing file.");
        };
      } else {
        alert("Error parsing file.");
      }
    },
  },
};
</script>

<style lang="scss">
@import "./dialogs.scss";

#select-file-dialog {
  @include show-dialog;

  .dialog-button-holder {
    display: flex;
    flex-direction: row;
  }

  .upload-method-button {
    height: 80px;
    margin: 5px;
    padding: 0px 25px;

    svg {
      margin-right: 20px;
    }
  }
}
</style>
