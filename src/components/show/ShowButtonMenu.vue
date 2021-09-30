<template>
  <div
    id="button-menu"
    :class="{ reversed: !this.$store.state.show.rightHand }"
  >
    <div>
      <vibration-button
        @click="nextInstruction"
        class="big"
        :disabled="!enableNextInstructionButton"
        v-if="!isFinished"
        >Next</vibration-button
      >

      <vibration-button @click="finish" class="big" v-if="isFinished"
        >Finish</vibration-button
      >
    </div>

    <div class="distancer"></div>

    <vibration-button
      @click="returnToHome"
      :class="{
        right: true,
      }"
      ><font-awesome-icon icon="home"
    /></vibration-button>

    <vibration-button
      @click="togglePreferences"
      :disabled="disablePreferences"
      :class="{
        right: true,
        pressed: $store.state.show.settingsOpened,
      }"
      ><font-awesome-icon icon="cogs"
    /></vibration-button>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import VibrationButton from "./VibrationButton.vue";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

export default {
  name: "show-button-menu",
  components: { VibrationButton, FontAwesomeIcon },

  mounted: function () {
    document.addEventListener("keydown", this.keydown);
  },

  unmounted: function () {
    document.removeEventListener("keydown", this.keydown);
  },

  computed: {
    ...mapGetters({
      hasNextInstruction: "show/hasNextInstruction",
      hasNextSubstance: "show/hasNextSubstance",
    }),

    enableNextInstructionButton: function () {
      return (
        this.hasNextInstruction && this.$store.state.show.shownDialog === "none"
      );
    },

    isFinished: function () {
      return (
        this.$store.getters["show/instructionsLoaded"] &&
        !this.$store.getters["show/hasNextInstruction"]
      );
    },

    disablePreferences: function () {
      return false;
    },
  },

  methods: {
    returnToHome: function () {      
      this.$store.commit("show/openDialog", "return-to-home");
    },

    lastInstruction: function () {
      this.$store.commit("show/lastInstruction");
    },

    nextInstruction: function () {
      this.$store.commit("show/nextInstruction");
    },

    finish: function () {
      this.$store.commit("show/finishPipetting");
    },

    togglePreferences: function () {
      this.$store.commit(
        "show/toggleSettings",
        !this.$store.state.show.settingsOpened
      );
    },

    keydown: function (e) {
      if (e.repeat) {
        return;
      }

      if (e.keyCode === 39 || e.keyCode === 40) {
        this.nextInstruction();
      }

      if (e.keyCode === 37 || e.keyCode === 38) {
        this.lastInstruction();
      }
    },
  },
};
</script>

<style lang="scss">
#button-menu {
  max-height: 18vw; /* don't be that much higher than wide */
  height: 15vh;
  width: 100%;
  box-sizing: border-box;
  flex: 0 0 auto;

  background-color: #222;
  border-style: solid none none none;
  border-width: 3px;
  border-color: #222;

  display: flex;
  padding: 0px 0.6vh;

  &.reversed {
    flex-direction: row-reverse;
  }

  div {
    height: 100%;
  }

  button {
    height: calc(100% - 2.6vh);
    width: 14vh;
    max-width: 14vw;

    margin: 0.7vh;

    &.big {
      width: 28vh;
      max-width: 28vw;
    }

    &.right {
      margin: 0.7vh;
    }
  }

  .distancer {
    flex: 1 1 auto;
  }

  .button-icon {
    width: 75%;
  }
}
</style>
