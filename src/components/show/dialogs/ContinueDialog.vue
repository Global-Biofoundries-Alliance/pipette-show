<template>
  <div id="continue-dialog">
    <p>The last loaded experiment has not been finished.<br/>
    Do you want to continue pipetting or load a new experiment?</p>      
    <div>      
      <vibration-button @click="abortPipetting">Load new Experiment</vibration-button>
      <vibration-button @click="continuePipetting">Continue</vibration-button>
    </div>
  </div>
</template>

<script>
import VibrationButton from "../VibrationButton.vue";

export default {
  name: "continueDialog",
  components: {VibrationButton},

  data() {
    return {};
  },

  methods: {
    continuePipetting: function() {
      this.$store.commit('show/openDialog', 'none');
    },

    abortPipetting: function() {
      this.$store.commit('show/abortPipetting');
    } 
  },

};
</script>

<style lang="scss">
@import "./dialogs.scss";

#continue-dialog {
  @include show-dialog; 
}
</style>
