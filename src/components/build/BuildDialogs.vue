<template>
  <modal-dialog v-model="showDriveSavedDialog" title="File saved">
    <p>The project was saved to your Google Drive.</p>
    <button @click="showGoogleDrive">Show Google Drive</button>
  </modal-dialog>

  <modal-dialog class="drive-install-dialog" v-model="showInstallToDriveDialog" title="Install to Google Drive">
    <p>Do you want to install PipetteShow to your Google Drive?</p>

    <label><input v-model="hideInstallDialog" type="checkbox"/>Don't show this message again</label>
    <br/>

    <div class="drive-install-dialog-button-holder">
      <button @click="dialog = undefined">No</button>
      <button @click="installToGoogleDrive">Yes</button>      
    </div>
  </modal-dialog>

  <modal-dialog
    class="transfer-code-dialog"
    v-model="showTransferCodeDialog"
    title="Transfer-Code"
  >
    <div class="row">
      <img class="transfer-code" :src="options.img" /><br />
      <p>
        Use this QR-Code to transfer your project onto your tablet. Your code is
        valid for up to three days.
      </p>
    </div>
    <p class="link" @click="copyToClipboard(options.code)">
      {{ options.code }} <font-awesome-icon :icon="['far', 'copy']" />
    </p>
  </modal-dialog>
</template>

<script>
import ModalDialog from "./ModalDialog.vue";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import UIkit from "uikit";
import { installDriveApp } from "../../lib/GoogleAuth.js";

export default {
  name: "build-dialogs",

  components: {
    ModalDialog,
    FontAwesomeIcon,
  },

  data: function () {
    return {
      dialog: undefined,
      options: {},
    };
  },

  computed: {
    showTransferCodeDialog: {
      get: function () {
        return this.dialog === "transfer-code";
      },

      set: function (val) {
        if (val) this.dialog = "transfer-code";
        else this.dialog = undefined;
      },
    },

    showDriveSavedDialog: {
      get: function () {
        return this.dialog === "drive-saved";
      },

      set: function (val) {
        if (val) this.dialog = "drive-saved";
        else this.dialog = undefined;
      },
    },

    showInstallToDriveDialog: {
      get: function() {
        return this.dialog === "drive-install";
      },

      set: function(val) {
        if (val) this.dialog = "drive-install";
        else this.dialog = undefined;
      }
    },

    hideInstallDialog: {
      get: function() {
        return this.$store.state.build.hideInstallToDriveDialog;
      },

      set: function(val)
      {
        if(val)
          this.$store.commit('build/hideInstallToDriveDialog');
      }
    }
  },

  mounted: function () {
    let thi = this;
    this.$eventbus.on("show-dialog", function (opt) {
      
      //Don't show drive-install-dialog if it was hidden
      if(opt.dialog === 'drive-install' && thi.hideInstallDialog)
        return;

      thi.dialog = opt.dialog;
      thi.options = opt;
    });
  },

  methods: {
    showGoogleDrive: function () {
      if(this.options.folder === undefined)
        window.open("https://drive.google.com/drive/my-drive", "_blank");
      else
        window.open("https://drive.google.com/drive/folders/"+this.options.folder, "_blank");
    },

    copyToClipboard: function (str) {
      navigator.clipboard.writeText(str);

      UIkit.notification({
        message: "Copied link to clipboard!",
        status: "success",
        pos: "bottom-center",
        timeout: 3000,
      });
    },

    installToGoogleDrive: function() {
      installDriveApp();
      this.showInstallToDriveDialog = false;
    }
  },
};
</script>

<style lang="scss">
.transfer-code-dialog {
  color: black;

  .row {
    display: flex;

    p {
      max-width: 220px;
      margin: auto;
    }
  }

  p.link {
    cursor: copy;
    padding: 3px 12px;

    &:hover {
      background-color: #ddd;
    }

    &:active {
      background-color: #ccc;
    }
  }
}

.drive-install-dialog
{
  .drive-install-dialog-button-holder
  {
    text-align: center;

    button
    {
      margin-top: 10px;
      margin-left: 10px;
    }
  }
}
</style>
