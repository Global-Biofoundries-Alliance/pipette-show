<template>
  <table
    class="plate"
    :style="{
      'padding-left': marginLeft + '%',
      'padding-right': marginLeft + '%',
      'padding-top': marginTop + '%',
      'padding-bottom': marginTop + '%',
    }"
  >
    <!-- Header -->
    <div v-if="showLabels === true" class="row column-header-row">
      <div
        class="cell column-header"
        v-for="x in cols"
        :style="{ width: 100 / cols + '%' }"
        :key="'well_' + x"
      >
        {{ x }}
      </div>
    </div>

    <div
      class="row"
      v-for="y in rows"
      :style="{ height: 100 / rows + '%' }"
      :key="'well_' + y"
    >
      <div class="row-label" v-if="showLabels === true">{{ rowLabel(y) }}</div>
      <div
        class="cell"
        v-for="x in cols"
        :style="{ width: 100 / cols + '%' }"
        :key="wellId(x, y)"
      >
        <slot :well-id="wellId(x, y)" />
      </div>
    </div>
  </table>
</template>

<script>
export default {
  name: "regular-grid-plate",
  components: {},

  props: ["rows", "cols", "margin-left", "margin-top", "show-labels"],

  methods: {
    wellId: function (x, y) {
      return (y - 1) * this.cols + x - 1;
    },

    rowLabel: function (y) {
      return String.fromCharCode(64 + y);
    },
  },
};
</script>

<style scoped>
.plate {
  width: 100%;
  height: 100%;
  display: block;
}

.row-label {
  width: 16px;
  height: 16px;
  text-align: center;
  padding-right: 5px;
  margin: auto;
}

.column-header-row {
  padding-left: 21px;
}

.column-header {
  text-align: center;
}

.plate .row {
  display: flex;
}
</style>
