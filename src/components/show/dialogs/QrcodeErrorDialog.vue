<template>    
    <div id="qrcode-error-dialog">
      <p>
        Invalid transfer code.<br/>
        Please provide a transfer code that was created with PipetteShow-Build and is not older than 3 days.
      </p>      

      <div>
        <vibration-button @click="abort">Abort</vibration-button>    
        <vibration-button @click="retry">Retry</vibration-button>            
      </div>
  </div>
</template>

<script>
import VibrationButton from "../VibrationButton.vue";

export default {
  name: "qrcode-error-dialog",
  components: {VibrationButton},

  methods: {
    retry: function () {      
      this.$store.commit('show/openDialog', 'scan-code');
    },   

    abort: function () {      
      this.$store.commit('show/openDialog', 'load-file');
    },    
  },
};
</script>

<style lang="scss">
@import "./dialogs.scss";

#qrcode-error-dialog {
  @include show-dialog;    
}
</style>