<template>
  <div id="select-transfer-code-method-dialog">    
    <template v-if="error">      
      <p>The entered transfer-code is not valid.</p>      
      <div class="dialog-button-holder">
        <vibration-button @click="error=false">OK</vibration-button>
      </div>
    </template>

    <template v-else-if="manualInput">      
      <p>Transfer-Code:</p>
      <input style="min-width: 30vw;" type="text" v-model="code"/>
      <div class="dialog-button-holder">
        <vibration-button @click="abortManualInput">Abort</vibration-button><vibration-button @click="parseManualInput">OK</vibration-button>
      </div>
    </template>

    <template v-else>
      <p>How do you want to provide the transfer code?</p>

      <div class="dialog-button-holder">
        <vibration-button
          class="upload-method-button"
          @click="openDialog('load-file')"
          >Abort</vibration-button
        >
        <vibration-button
          class="upload-method-button"     
          @click="manualInput = true"   
          ><font-awesome-icon icon="keyboard" />Enter Code</vibration-button
        >
        <vibration-button
          class="upload-method-button"
          @click="$refs.uploader.click()"
          ><font-awesome-icon icon="cloud-upload-alt" />Upload</vibration-button
        >
        <vibration-button
          v-if="hasCamera"
          class="upload-method-button"
          @click="openDialog('scan-code')"
          ><font-awesome-icon icon="camera" />Webcam</vibration-button
        >
      </div>
    </template>

    <input
      style="display: none"
      type="file"
      ref="uploader"
      accept=".png"
      @change="parseQrCode"
    />
  </div>
</template>

<script>
import VibrationButton from "../VibrationButton.vue";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

import QrScanner from "qr-scanner";
import QrScannerWorkerPath from "!!file-loader!../../../../node_modules/qr-scanner/qr-scanner-worker.min.js";
QrScanner.WORKER_PATH = QrScannerWorkerPath;

import { finishScanning } from "../../../lib/TransferCodeLib.js";

export default {
  name: "select-transfer-code-method-dialog",
  components: { VibrationButton, FontAwesomeIcon },

  data: function() {
    return {hasCamera: false, manualInput: false, code: '', error: false};
  },  

  mounted: async function() {
    this.hasCamera = await QrScanner.hasCamera();    
  },

  methods: {
    openDialog: function (dialog) {
      this.$store.commit("show/openDialog", dialog);
    },

    parseManualInput: function() {
      if(this.code.startsWith('https://pipette-show.de/show/'))
      {
        this.code = this.code.substr('https://pipette-show.de/show/'.length);
      }
      
      if(this.code.match(/^[A-F0-9]+$/i) === null)
      {
        this.error = true;
      }
      else
      {        
        finishScanning(this.$store, 'https://pipette-show.de/show/' + this.code);
        this.manualInput = false;
        this.code = "";
      }            
    },

    abortManualInput: function() {
      this.manualInput = false;
      this.code = "";
    },

    parseQrCode: async function () {
      var file = this.$refs["uploader"].files[0];

      if (file) {
        let res = await QrScanner.scanImage(file);
        finishScanning(this.$store, res);
        this.$refs["uploader"].value = "";
      } else {
        alert("Error parsing file.");
      }
    },
  },
};
</script>
<style lang="scss">
@import "./dialogs.scss";

#select-transfer-code-method-dialog {
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
