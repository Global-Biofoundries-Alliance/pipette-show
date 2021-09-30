<template>
  <div class="pipette-instruction" :style="style">
    <div v-if="instruction === undefined">INVALID INSTRUCTION</div>
    <div v-else-if="instruction.operation === 'start'">
      Pipetting Project "{{ instruction.name }}"
    </div>
    <div v-else-if="instruction.operation === 'substance'">
      Change to substance {{ name }}
    </div>
    <div v-else-if="instruction.operation === 'multichannelvolume'">
      Set volume of multichannel-pipette to
      <amount-indicator> {{ instruction.value }} {{ unit }} </amount-indicator>
    </div>
    <div v-else-if="instruction.operation === 'volume'">
      Set volume to
      <amount-indicator> {{ instruction.value }} {{ unit }} </amount-indicator>
    </div>
    <div v-else-if="instruction.operation === 'multichanneladd'">
      Add
      <amount-indicator :color="color">
        {{ instruction.value }} {{ unit }}
      </amount-indicator>
      of {{ name }}
    </div>
    <div v-else>
      Add
      <amount-indicator :color="color">
        {{ instruction.value }} {{ unit }}
      </amount-indicator>
      of {{ name }}
    </div>

    <div class="step-indicator">
      {{ instructionIndex + 1 }} / {{ instructionCount }}
    </div>
  </div>
</template>
<script>
import AmountIndicator from "./AmountIndicator.vue";

export default {
  name: "pipette-instruction",

  components: { AmountIndicator },

  props: ["instruction-index", "style"],

  data: function () {
    return { unit: "µl" };
  },

  computed: {
    instruction: function () {
      return this.$store.state.show.file.instructions[this.instructionIndex];
    },

    substance: function () {
      return this.$store.state.show.file.substances[this.instruction.substance];
    },

    instructionCount: function () {
      return this.$store.getters["show/instructionCount"];
    },

    color: function () {
      if (this.substance === undefined) return "#888888";

      return this.substance.color;
    },

    name: function () {
      if (this.substance === undefined) return;

      return this.substance.name;
    },
  },
};
</script>
<style lang="scss">
.pipette-instruction {
  flex: 0 0 auto;

  font-size: 16pt;

  div:first-child {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%;
    width: 100%;

    position: relative;
  }

  .step-indicator {
    display: block;
    position: absolute;
    right: 0px;
    top: calc(50% - 6pt);
    margin-right: 20px;
  }

  .amount-indicator {
    height: 80%;
    max-height: 50px;

    margin-right: 12px;
    margin-left: 12px;
  }
}
</style>
