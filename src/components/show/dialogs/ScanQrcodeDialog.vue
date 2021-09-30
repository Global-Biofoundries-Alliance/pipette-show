<template>    
    <div id="scan-qrcode-dialog">
      <p>
        Please scan the transfer code from PipetteShow-Build.
      </p>      

      <vibration-button @click="abort">Abort</vibration-button>    
  </div>
</template>

<script>
import VibrationButton from "../VibrationButton.vue";

export default {
  name: "scan-qrcode-dialog",
  components: {VibrationButton},

  methods: {
    abort: function () {      
      this.$store.commit('show/openDialog', 'load-file');
    },    
  },
};
</script>
<style lang="scss">
@import "./dialogs.scss";

#scan-qrcode-dialog {
  @include show-dialog;    
}
</style>