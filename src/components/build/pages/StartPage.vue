<template>
  <div class="uk-container uk-margin-large-top uk-margin-bottom">
    <div uk-scrollspy="cls: uk-animation-fade;" class="uk-flex-center" uk-grid>
      <div class="uk-visible@m">
        <img src="../../../assets/build.png" alt="" />
      </div>
      <div>
        <div class="uk-card uk-card-default">
          <div class="uk-card-header">
            <h1 class="uk-heading-small serifs">Build Module</h1>
          </div>
          <div class="uk-card-body">
            <div>
              <ul class="uk-nav-default uk-nav-parent-icon" uk-nav>
                <li class="uk-margin-bottom">
                  <button
                    class="icon-button uk-button uk-button-primary"
                    @click="newProject"
                  >
                    <font-awesome-icon icon="file-medical" /> Create new Project
                  </button>
                </li>

                <li class="uk-parent uk-margin-bottom">
                  <a href="#">Open Project (*.pip-file)</a>
                  <ul class="uk-nav-sub">
                    <li>
                      <button
                        @click="$refs.uploader.show('.pip', nextStep)"
                        class="icon-button uk-button uk-width-3-4 uk-button-default uk-margin-small"
                      >
                        <font-awesome-icon icon="cloud-upload-alt" /> Upload
                      </button>
                    </li>
                    <li>
                      <button
                        @click="pickGoogleDriveFile"
                        class="icon-button uk-button uk-width-3-4 uk-button-default"
                      >
                        <font-awesome-icon :icon="['fab', 'google-drive']" />
                        Google Drive
                      </button>
                    </li>
                  </ul>
                  <hidden-file-uploader class="uk-hidden" ref="uploader" />
                </li>
                <li class="uk-parent uk-margin-bottom">
                  <a href="#">Import Data</a>
                  <ul class="uk-nav-sub">
                    <li>
                      <button
                        @click="$refs.uploader.show('.csv', nextStep)"
                        class="uk-button uk-width-3-4 uk-button-default uk-margin-small"
                      >
                        From CSV
                      </button>
                    </li>
                    <li>
                      <button
                        @click="$refs.uploader.show('.xls, .xlsx', nextStep)"
                        class="uk-button uk-width-3-4 uk-button-default uk-margin-small"
                      >
                        From XLS(X)
                      </button>
                    </li>
                    <li>
                      <button
                        @click="$refs.uploader.show('.json', nextStep)"
                        class="uk-button uk-width-3-4 uk-button-default uk-margin-small"
                      >
                        From DIVA or Opentrons (.json)
                      </button>
                    </li>                    
                  </ul>
                </li>
                <li class="uk-nav-divider">
                  <a href="#" @click="openSampleFile">Open Sample File</a>
                </li>
              </ul>
            </div>
          </div>

          <div class="uk-card-footer">
            <div>
              <button
                @click="$emit('back')"
                class="uk-button uk-margin-right uk-button-default"
              >
                Back
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import HiddenFileUploader from "../../common/HiddenFileUploader.vue";
import  { pickGoogleDriveFile, stringFileUploaded } from "../../../lib/IOLib.js";

import samplefile1 from '!raw-loader!../../Example_Project.pip';

export default {
  name: "start-page",

  emits: ["continue", "back", "change-query-state"],

  components: { FontAwesomeIcon, HiddenFileUploader },

  methods: {
    newProject: function (e) {
      e.preventDefault();
	  this.$emit('change-query-state', undefined);

      this.$store.commit("build/createNewfile");
      this.$emit("continue");
    },

    nextStep: function () {
      this.$emit("continue");
    },

    openSampleFile: function () {
      stringFileUploaded(this.$store, 'Example_Project.pip', samplefile1, 'build');
      this.nextStep();
    },


    pickGoogleDriveFile: function () {
      pickGoogleDriveFile(this.$store, 'build', (fileId) => {
        //Override url-parameter in order to save this file back to google drive per default in export-page
        this.$emit('change-query-state', {action: "open", ids: [fileId]});        

        //this.$eventbus.emit("show-dialog", {
        //  dialog: "drive-install"          
        //});

        this.nextStep();
      });
    },
  },
};
</script>

<style></style>
