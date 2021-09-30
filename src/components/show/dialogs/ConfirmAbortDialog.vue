<template>
  <div id="confirm-abort-dialog">
    <p>Do you really want to abort the current experiment?</p>
    <div>
      <vibration-button @click="continuePipetting">No</vibration-button>
      <vibration-button @click="abortPipetting">Yes</vibration-button>
    </div>
  </div>
</template>

<script>
import VibrationButton from "../VibrationButton.vue";

export default {
  name: "confirm-abort-dialog",
  components: { VibrationButton },

  data() {
    return {};
  },

  methods: {
    continuePipetting: function () {
      this.$store.commit("show/openDialog", "none");
    },

    abortPipetting: function () {
      this.$store.commit("show/abortPipetting");
    },
  },
};
</script>

<style lang="scss">
@import "./dialogs.scss";

#confirm-abort-dialog {
  @include show-dialog;
  @include always-on-top;  
}
</style>
