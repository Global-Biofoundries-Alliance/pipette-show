<template>
  <div id="resize-dialog">
    <p>Use the yellow triangles to resize the plate.</p>
    <div>
      <vibration-button @click="restoreDefaults"
        >Restore Defaults</vibration-button
      >
      <vibration-button @click="abort">Abort</vibration-button>
      <vibration-button @click="close">Save</vibration-button>
    </div>
  </div>
</template>

<script>
import VibrationButton from "../VibrationButton.vue";

export default {
  name: "resize-dialog",
  components: { VibrationButton },

  data() {
    return {};
  },

  methods: {
    restoreDefaults: function () {
      this.$eventbus.emit("restore-default-plate-size");
    },

    close: function () {
      this.$store.commit("show/stopResizing");
    },

    abort: function () {
      this.$store.commit("show/abortResizing");
      this.$eventbus.emit("abort-plate-size-change");
    },
  },
};
</script>

<style lang="scss">
@import "./dialogs.scss";

#resize-dialog {
  @include show-dialog;
  @include always-on-top;
}
</style>
