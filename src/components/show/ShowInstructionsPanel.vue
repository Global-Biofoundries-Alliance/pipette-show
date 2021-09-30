<template>
  <div id="instructions-panel">
    <div class="instructions-wheel">
      <pipette-instruction
        v-for="i in instructionCount"
        :style="makeInstructionStyle(i - 1)"
        :key="i - 1"
        :instruction-index="i - 1"
      />
    </div>
    <div class="instructions-obfuscator"></div>
  </div>
</template>
<script>
import { mapGetters } from "vuex";
import gsap from "gsap";

import PipetteInstruction from "./PipetteInstruction.vue";

export default {
  name: "show-instructions-panel",

  components: { PipetteInstruction },

  data: function () {
    return { position: 0, unit: "µl" };
  },

  mounted: function () {
    this.position = this.currentInstructionIndex;
  },

  computed: {
    ...mapGetters({
      currentInstruction: "show/currentInstruction",
      currentSubstance: "show/currentSubstance",
      instructionCount: "show/instructionCount",
    }),

    currentInstructionIndex: function () {
      return this.$store.state.show.currentInstructionIndex;
    },
  },

  watch: {
    currentInstructionIndex: function (val) {
      gsap.to(this.$data, { duration: 0.3, position: val });
    },
  },

  methods: {
    makeInstructionStyle: function (i) {
      //Hide elements that are far away from the current index
      if (i < this.position - 2 || i > this.position + 2) {
        return { display: "none" };
      } else {
        let dy = this.position - i;
        let angle = 50 * dy;
        let y = 33 * (1 - dy);
        let margin = 8 + Math.abs(dy) * 6;

        let style = {
          transform: "rotateX(" + angle + "deg)",
          top: y + "%",
          width: "calc(100% - " + 2 * margin + "px)",
          "margin-left": margin + "px",
        };

        return style;
      }
    },
  },
};
</script>
<style lang="scss">
#instructions-panel {
  background-color: #f4f4f4;
  -webkit-box-shadow: inset 0 0 10px #333;
  box-shadow: inset 0 0 10px #333;

  width: 100%;

  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  position: relative;

  .instructions-wheel {
    height: 100%;
    width: 100%;

    overflow: hidden;
    position: relative;

    -webkit-perspective: 5000;

    display: flex;
    flex-direction: column;
  }

  .instructions-obfuscator {
    position: absolute;
    top: 0px;
    bottom: 0px;
    left: 0px;
    right: 0px;

    opacity: 0.8;
    background: linear-gradient(
      0deg,
      #aaa,
      #ccc,
      #00000000,
      #00000000,
      #ccc,
      #aaa
    );
  }

  .pipette-instruction {
    height: 33%;
    width: calc(100% - 16px);

    margin-left: 8px;
    margin-right: 8px;
    color: rgba(0, 0, 0, 0.9);

    position: absolute;

    border-style: solid;
    background-color: #eee;
    border-width: 1px;
  }
}
</style>
