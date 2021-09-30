<template>
  <div v-if="!ignored" id="landscape-mode-dialog">
    <p>PipetteShow is not intended to be used in landscape orientation.<br/> Please turn your device by 90°.</p>      
    <div>
      <vibration-button @click="ignore">Ignore</vibration-button>      
    </div>
  </div>
</template>

<script>
import VibrationButton from "../VibrationButton.vue";

export default {
  name: "landscape-mode-dialog",
  components: {VibrationButton},

  data() {
    return {ignored: false};
  },

  methods: {
    ignore: function() {
      this.ignored = true;
    },
  },

};
</script>

<style>
#landscape-mode-dialog {
  text-align: center;
  width: 100%;
  height: 100%;

  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  color: #bbb;

  background-color: black;
  position: absolute;
}

#landscape-mode-dialog div
{
  display: flex;
}

#landscape-mode-dialog .vibration-button
{
  margin: 5px;
  padding: 5px 30px;
}

@media screen and (orientation: portrait) {
  #landscape-mode-dialog {
    display: none;
  }
}
</style>
