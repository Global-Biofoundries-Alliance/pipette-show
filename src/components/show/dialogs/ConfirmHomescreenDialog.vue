<template>
  <div id="confirm-homescreen-dialog">
    <p>Do you really want to leave the Show Module?</p>
    <div>
      <vibration-button @click="continuePipetting">No</vibration-button>
      <vibration-button @click="backToHomeScreen">Yes</vibration-button>
    </div>
  </div>
</template>

<script>
import VibrationButton from "../VibrationButton.vue";

export default {
  name: "confirm-homescreen-dialog",
  components: { VibrationButton },

  methods: {
    continuePipetting: function () {
      this.$store.dispatch("show/abortDialog");
    },

    backToHomeScreen: function () {
      this.$router.push("/");
    },


  },
};
</script>

<style lang="scss">
@import "./dialogs.scss";

#confirm-homescreen-dialog {
  @include show-dialog;
  @include always-on-top;  
}
</style>
