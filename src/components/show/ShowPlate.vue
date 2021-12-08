<template>
  <div id="show-plate">
    <plate-holder :physical-plate-properties="plateProperties" :instruction-type="this.highlightedWell">
      <regular-grid-plate
        :cols="plateProperties.cols"
        :rows="plateProperties.rows"
        v-slot="slotProps"
        :margin-left="margins.left"
        :margin-top="margins.top"
      >
        <circular-labeled-well
          
          :currentColor="getWellColor(slotProps.wellId)"
          :radius="wellRadius"
        />
      </regular-grid-plate>
    </plate-holder>
  </div>
</template>

<script>
import PlateHolder from "./PlateHolder.vue";
import RegularGridPlate from "../common/RegularGridPlate.vue";
import CircularLabeledWell from "../common/CircularLabeledWell.vue";

export default {
  name: "show-plate",
  components: { PlateHolder, RegularGridPlate, CircularLabeledWell },

  props: ["highlighted-well"],

  computed: {
    plateProperties: function () {
      return this.$store.state.show.plate.dimensions;
    },

    wellRadius: function () {
      return (
        (this.plateProperties.radius /
          (this.plateProperties.width - 2 * this.plateProperties.marginLeft)) *
        this.plateProperties.cols *
        100
      );
    },

    margins: function () {
      return {
        top:
          (this.plateProperties.marginTop / this.plateProperties.width) * 100,
        left:
          (this.plateProperties.marginLeft / this.plateProperties.width) * 100,
      };
    },

    currentSubstanceColor: function () {
      var currentIndex =  this.$store.state.show.currentInstructionIndex;
      var currentInstruction = this.$store.state.show.file.instructions[currentIndex];
      return this.$store.state.show.file.substances[currentInstruction.substance].color;
    },

    resizing: function () {
      console.log("resize");
      return this.$store.state.show.resizing;
    },

  },

  methods: {
    getWellClasses: function (wellId) {
      var classes = [];

      if (this.highlightedWell === wellId) classes.push("highlighted");

      return classes;
    },

    getWellColor: function (wellId) {
      var classes = [];
      if (this.resizing) {
        console.log("returned fff");
        return '#fff';
        }
      if (!Array.isArray(this.highlightedWell) && this.highlightedWell === wellId) {
        return this.currentSubstanceColor;
        }

      if (Array.isArray(this.highlightedWell) && this.highlightedWell.includes(wellId)) {
        return this.currentSubstanceColor;
        }

      return '#666';
    },
  },
};
</script>

<style></style>
