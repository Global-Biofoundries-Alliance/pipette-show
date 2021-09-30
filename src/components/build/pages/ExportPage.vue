<template>
  <div class="uk-container uk-margin-large-top uk-margin-bottom">
    <div class="uk-flex uk-flex-center">
      <div
        uk-scrollspy="cls: uk-animation-fade;"
        class="uk-card uk-card-default"
      >
        <div class="uk-card-header">
          <h2 class="uk-card-title serifs">Export</h2>
        </div>
        <div
          class="uk-card-body uk-padding-large uk-margin-left uk-margin-right"
        >
          <ul class="uk-nav-default uk-nav-parent-icon" uk-nav>
            <li class="uk-parent uk-margin-bottom">
              <a href="#">Download as</a>
              <ul class="uk-nav-sub">
                <li>
                  <button
                    @click="downloadFile('pip')"
                    class="uk-button uk-width-4-5 uk-button-default uk-margin-small"
                  >
                    .PIP-File
                  </button>
                </li>
                <li>
                  <button
                    @click="downloadFile('csv')"
                    class="uk-button uk-width-4-5 uk-button-default uk-margin-small"
                  >
                    .CSV-File
                  </button>
                </li>                
              </ul>
            </li>
            <li>
              <button
                @click="saveToGoogleDrive"
                :class="{'icon-button': true, 'uk-button': true, 'uk-width-1': true, 'uk-button-default': !defaultToGoogleDrive, 'uk-button-primary': defaultToGoogleDrive, 'uk-margin-small': true}"
              >
                <font-awesome-icon :icon="['fab', 'google-drive']" /> Save in
                Google Drive
              </button>
            </li>
            <li>
              <button
                :class="{'icon-button': true, 'uk-button': true, 'uk-width-1': true, 'uk-button-default': defaultToGoogleDrive, 'uk-button-primary': !defaultToGoogleDrive}"                
                @click="getTransferCode"
              >
                <font-awesome-icon icon="qrcode" /> Create transfer code
              </button>
            </li>
          </ul>
        </div>

        <div class="uk-card-footer">
          <div>
            <button
              @click="$emit('back')"
              class="uk-button uk-margin-right uk-button-secondary"
            >
              Back
            </button>
            <button @click="$emit('finish')"
          class="uk-button uk-button-primary uk-margin-left uk-float-right"
        >
          <font-awesome-icon icon="home"/>
        </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import {
  downloadFile,
  saveToGoogleDrive,
  getTransferCode,
} from "../../../lib/IOLib.js";

export default {
  name: "export-page",

  emits: ["back"],

  props: ['query-state'],

  components: { FontAwesomeIcon },

  data: function() {
    return {defaultToGoogleDrive: false, googleDriveFile: undefined, googleDriveFolder: undefined};
  },

  mounted: function() {

    //Check if a queryString from Google Drive is present
    if(this.queryState !== undefined)
    {
      if(this.queryState.action === "create")
      {
        this.defaultToGoogleDrive = true;
        this.googleDriveFolder = this.queryState.folderId;        
      }      
      else if(this.queryState.action === "open")
      {
        this.defaultToGoogleDrive = true;
        this.googleDriveFile = this.queryState.ids[0];        
      }   
    }      
  },

  methods: {
    downloadFile: function (format) {
      return downloadFile(this.$store, format);
    },

    saveToGoogleDrive: async function () {
	  if(this.googleDriveFile !== undefined)
      {
        saveToGoogleDrive(this.$store, this.$eventbus, this.googleDriveFile, true);
      }
      else
      {
        saveToGoogleDrive(this.$store, this.$eventbus, this.googleDriveFolder, false);
      }      
    },

    getTransferCode: async function () {
      getTransferCode(this.$store, this.$eventbus);
    },
  },
};
</script>

<style></style>
