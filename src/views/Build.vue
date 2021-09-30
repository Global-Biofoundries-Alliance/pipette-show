<template>
  <div class="build-app uk-height-1-1 uk-flex uk-flex-column">
    <build-navigation v-model="page" />
    <div class="build-page uk-flex-auto uk-flex uk-flex-column">
      <start-page
        v-if="page === 'start'"
        @back="returnToMainMenu"
        @continue="page = 'properties'"
        @change-query-state="changeQueryState"
      />
      <properties-page
        v-if="page === 'properties'"
        @back="page = 'start'"
        @continue="page = 'substances'"
      />
      <substances-page
        v-if="page === 'substances'"
        @back="page = 'properties'"
        @continue="page = 'wells'"
      />

      <div
        v-show="page === 'wells'"
        class="build-page-inner uk-flex uk-flex-auto uk-flex-column"
      >
        <build-header
          @back="page = 'substances'"
          @continue="page = 'summary'"
        />
        <build-table
          ref="table"
          @back="page = 'substances'"
          @continue="page = 'summary'"
        />
      </div>

      <summary-page        
        v-if="page === 'summary'"        
        @back="page = 'wells'"
        @continue="page = 'export'"
      />

      <export-page v-if="page === 'export'" :query-state="queryState" @back="page = 'summary'" @finish="returnToMainMenu"/>
    </div>

    <build-dialogs ref="dialogs" />
    <pipetteshow-footer :small="true" />


  </div>
</template>

<script>
import PipetteshowFooter from "../components/common/PipetteshowFooter.vue";
import BuildNavigation from "../components/build/BuildNavigation.vue";

import BuildHeader from "../components/build/BuildHeader.vue";
import BuildTable from "../components/build/BuildTable.vue";

import StartPage from "../components/build/pages/StartPage.vue";
import PropertiesPage from "../components/build/pages/PropertiesPage.vue";
import SubstancesPage from "../components/build/pages/SubstancesPage.vue";
import SummaryPage from "../components/build/pages/SummaryPage.vue";
import ExportPage from "../components/build/pages/ExportPage.vue";

import BuildDialogs from "../components/build/BuildDialogs.vue";

import { getGoogleDriveFile } from "../lib/IOLib.js";

export default {
  name: "build",
  components: {
    StartPage,
    PropertiesPage,
    SubstancesPage,
    ExportPage,

    BuildDialogs,
    BuildTable,
    SummaryPage,
    BuildHeader,
    BuildNavigation,
    PipetteshowFooter,
  },

  data: function () {
    return { page: "start", queryState: undefined };
  },

  mounted: function() {
    //Save query state parameter
    if(this.$route.query !== undefined && this.$route.query.state !== undefined)
        this.queryState = JSON.parse(this.$route.query.state);

    //Check if a queryString from Google Drive is present
    if(this.queryState !== undefined)
    {
      if(this.queryState.action === "create")
      {
        this.$store.commit("build/createNewfile", {name: "New_Google_Drive_Project"});
        this.page = 'properties';
      }      
      else if(this.queryState.action === "open")
      {        
        getGoogleDriveFile(this.$store, undefined, this.queryState.ids[0], undefined, "build");
        this.page = 'properties';
      }
    }      
  },

  methods: {
    returnToMainMenu: function () {
      this.$router.push("/");
    },

    changeQueryState: function(newState) {
      this.queryState = newState;
    }
  },
};
</script>

<style></style>
