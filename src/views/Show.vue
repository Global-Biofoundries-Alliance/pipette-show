<template>
  <div id="show-activity">    
    <show-qr-scanner v-if="$store.state.show.shownDialog === 'scan-code'" />
    <show-plate v-else-if="instructionsLoaded" :highlighted-well="currentWell" />
    <show-divider />

    <div class="content-panel">
      <component :is="shownDialog"></component>

      <!-- Always include fullscreen- and landscape-mode-dialog: They are shown/hidden via media queries -->
      <landscape-mode-dialog />
      <request-fullscreen-dialog />      

      <settings-panel />
    </div>
    <show-button-menu />
  </div>
</template>
<script>
import { mapGetters } from "vuex";

import ShowQrScanner from "../components/show/ShowQrScanner.vue";
import ShowPlate from "../components/show/ShowPlate.vue";
import ShowDivider from "../components/show/ShowDivider.vue";

import ShowInstructionsPanel from "../components/show/ShowInstructionsPanel.vue";
import SettingsPanel from "../components/show/SettingsPanel.vue";

import SelectFileDialog from "../components/show/dialogs/SelectFileDialog.vue";
import SelectTransferCodeMethodDialog from "../components/show/dialogs/SelectTransferCodeMethodDialog.vue";
import ScanQrcodeDialog from "../components/show/dialogs/ScanQrcodeDialog.vue";
import QrcodeErrorDialog from "../components/show/dialogs/QrcodeErrorDialog.vue";
import ContinueDialog from "../components/show/dialogs/ContinueDialog.vue";
import RequestFullscreenDialog from "../components/show/dialogs/RequestFullscreenDialog.vue";
import FinishedDialog from "../components/show/dialogs/FinishedDialog.vue";
import ConfirmAbortDialog from "../components/show/dialogs/ConfirmAbortDialog.vue";
import PanelResizeDialog from "../components/show/dialogs/PanelResizeDialog.vue";
import RecentExperimentsDialog from "../components/show/dialogs/RecentExperimentsDialog.vue";
import LandscapeModeDialog from "../components/show/dialogs/LandscapeModeDialog.vue";
import ConfirmHomescreenDialog from "../components/show/dialogs/ConfirmHomescreenDialog.vue";

import ShowButtonMenu from "../components/show/ShowButtonMenu.vue";

import { finishScanning, linkAdress } from "../lib/TransferCodeLib.js";
import { getGoogleDriveFile } from '../lib/IOLib.js';

export default {
  name: "show",
  components: {
    ShowQrScanner,
    ShowPlate,
    ShowDivider,
    ShowButtonMenu,
    ShowInstructionsPanel,
    SelectFileDialog,
    SelectTransferCodeMethodDialog,
    ScanQrcodeDialog,
    QrcodeErrorDialog,
    ContinueDialog,
    RequestFullscreenDialog,
    ConfirmAbortDialog,
    FinishedDialog,
    PanelResizeDialog,
    LandscapeModeDialog,
    ConfirmHomescreenDialog,
    RecentExperimentsDialog,
    SettingsPanel,
  },

  data: function () {
    return {
      currentDialog: QrcodeErrorDialog,
    };
  },

  mounted: async function () {
    this.$store.dispatch("show/pageMount");


    if (this.$route.params.transfercode !== undefined) {
      finishScanning(this.$store, linkAdress + this.$route.params.transfercode);
    }

    //Check if a queryString from Google Drive is present
    else if(this.$route.query !== undefined && this.$route.query.state !== undefined)
    {
      let state = JSON.parse(this.$route.query.state);
      
      if(state.action === "open")
      {        
        getGoogleDriveFile(this.$store, undefined, state.ids[0], undefined, "show");       
      }
    }      
  },

  computed: {
    ...mapGetters({
      currentWell: "show/currentWell",
	  instructionsLoaded: "show/instructionsLoaded",
    }),

    shownDialog: function () {
      if (this.$store.state.show.resizing) {
        return PanelResizeDialog;
      }
      switch (this.$store.state.show.shownDialog) {
        case "load-file":
          return SelectFileDialog;
        case "select-transfer-code-method":
          return SelectTransferCodeMethodDialog;
        case "scan-code":
          return ScanQrcodeDialog;
        case "qrcode-error":
          return QrcodeErrorDialog;
        case "continue":
          return ContinueDialog;
        case "confirm-abort":
          return ConfirmAbortDialog;
        case "return-to-home":
          return ConfirmHomescreenDialog;
        case "show-recent-experiments":
          return RecentExperimentsDialog;
        case "finished":
          return FinishedDialog;
        default:
          return ShowInstructionsPanel;
      }
    },
  },
};
</script>
<style lang="scss">
#show-activity {
  background-color: black;
  height: 100%;
  display: flex;
  flex-direction: column;
  position: relative;

  .content-panel {
    display: flex;
    flex-direction: row;

    flex: 1 1 auto;

    overflow-x: hidden;
    font-size: 24pt;
    position: relative;

    /*& > div {
      overflow-y: auto;   //Shows an ugly scroll-bar when opening/closing settings. Is it necessary?
    }*/

    p {
      margin: 5px;
    }
  }
}
</style>
