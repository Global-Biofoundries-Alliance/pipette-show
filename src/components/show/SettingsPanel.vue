<template>
  <div
    v-if="pos > 0"
    id="settings-panel"
    @click="closePanel"
    :style="{
      'background-color': 'rgba(22, 22, 22, ' + panelTransparency + ')',
    }"
  >
    <!-- :style="{ 'margin-top': '80%' /*300-pos + 'px'*/, order: 2 - modePosition }"-->
    <div
      class="inner-fixed-panel"
      @click.stop="doNothing"
      :style="{ bottom: pos - 100 + '%' }"
    >
      <vibration-button
        @click="lastInstruction"
        :disabled="!instructionsLoaded || !hasLastInstruction"
        ><font-awesome-icon icon="undo" />&nbsp;Back</vibration-button
      >
      <vibration-button @click="abortPipetting" :disabled="!instructionsLoaded"
        >Abort Experiment</vibration-button
      >
      <vibration-button @click="adjustPlateHolder" :disabled="!instructionsLoaded"
        ><font-awesome-icon icon="crop-alt" />&nbsp;&nbsp;Adjust
        Plate-Holder</vibration-button
      >
      <vibration-button @click="toggleLeftMode"
        ><font-awesome-icon icon="hand-paper" />&nbsp;&nbsp;{{
          rightHandMode
        }}
        Mode</vibration-button
      >
    </div>
  </div>
</template>
<script>
import gsap from "gsap";
import { mapGetters } from "vuex";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import VibrationButton from "./VibrationButton.vue";

export default {
  name: "settings-panel",

  components: { VibrationButton, FontAwesomeIcon },

  data: function () {
    return { pos: 0 };
  },

  mounted: function () {
    if (this.opened) {
      this.pos = 100;
    }
  },

  watch: {
    opened: function (val) {
      if (val === true) {
        this.open();
      } else {
        this.close();
      }
    },
  },

  computed: {
    opened: function () {
      return this.$store.state.show.settingsOpened;
    },

    rightHandMode: function () {
      if (this.$store.state.show.rightHand) {
        return "right";
      }
      return "left";
    },

    modePosition: function () {
      if (this.$store.state.show.rightHand) {
        return -1;
      }
      return 1;
    },

    panelTransparency: function () {
      return (0.8 * this.pos) / 100;
    },

    ...mapGetters({
      instructionsLoaded: "show/instructionsLoaded",
      hasLastInstruction: "show/hasLastInstruction",
    }),
  },

  methods: {
    open: function () {
      gsap.to(this.$data, { duration: 0.3, pos: 100 });
    },

    close: function () {
      gsap.to(this.$data, { duration: 0.5, pos: 0 });
    },

    lastInstruction: function () {
      this.$store.commit("show/lastInstruction");
    },

    abortPipetting: function () {
      this.closePanel();
      this.$store.commit("show/openDialog", "confirm-abort");
    },

    adjustPlateHolder: function () {
      this.closePanel();
      this.$store.commit("show/startResizing");
    },

    closePanel: function () {
      this.$store.commit("show/toggleSettings", false);
    },

    doNothing: function () {},

    toggleLeftMode: function () {
      this.$store.commit(
        "show/setRightHand",
        !this.$store.state.show.rightHand
      );
    },
  },
};
</script>
<style lang="scss">
#settings-panel {
  flex: 0 0 auto;
  overflow: hidden;
  padding: 0px;
  width: 100%;
  height: 100%;

  position: absolute;

  button {
    width: 200px;
    height: 80px;

    margin: 8px 20px;
    flex: 0 0 auto;
  }

  .inner-fixed-panel {
    position: absolute;
    width: 100%;
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;

    background-color: #ccc;
    bottom: 0px;

    padding-top: 2px;

    border-style: solid none none none;
    border-width: 8px;
    border-color: #222;
  }
}
</style>
