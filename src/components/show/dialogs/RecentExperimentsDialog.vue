<template>
  <div id="recent-experiments-dialog">
    <p>Recent Experiments:</p>
    <div>
      <vibration-button v-for="(f, i) in $store.state.show.recentFiles" :key="i" @click="openFile(f)">{{f.file.name}} <span class="date">Last used {{formatTime(f.date)}}</span></vibration-button>

      <vibration-button class="abort-button" @click="continuePipetting">Abort</vibration-button>      
    </div>
  </div>
</template>

<script>
import VibrationButton from "../VibrationButton.vue";
import plates from "../../../lib/PlatesLib.js";

export default {
  name: "confirm-homescreen-dialog",
  components: { VibrationButton },

  methods: {
    continuePipetting: function () {
      this.$store.dispatch("show/abortDialog");
    },

    formatTime: function(timestamp)
    {
      let date = new Date(timestamp);
      let toStr = date.toString();
      let end = toStr.indexOf(':') + 3;
      return toStr.substr(0, end);
    },

    openFile: function(f) {
      this.$store.commit("show/loadInstructions", {
        file: f.file,
        plate: plates[f.plate],
      });
    }
  },  
};
</script>

<style lang="scss">
@import "./dialogs.scss";

#recent-experiments-dialog {
  @include show-dialog;

  div
  {
    flex-wrap: wrap;
  }

  button
  {
    display: flex;
    flex-direction: column;

    .date
    {
      color: #888;
      font-size: 16pt;
      margin-top: 5px;
    }

    &.abort-button
    {
      padding-top: 19px;
    }
  }  
}
</style>
