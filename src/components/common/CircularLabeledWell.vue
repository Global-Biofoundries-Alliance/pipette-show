<template>
  <div
    :class="{ well: true, interactive: interactive }"
    :style="{ width: radius + '%', height: radius + '%', backgroundColor: currentColor }"
    @click="$emit('click')"
  >
    <span>{{ label }}</span>
  </div>
</template>

<script>
export default {
  name: "cirular-labeled-well",

  data() {
    return {};
  },

  props: {label:{default:""}, radius:{default:0}, interactive:{default:false}, currentColor:{default:"#666"}},


};
</script>

<style lang="scss">
.well {
  background-color: #666;
  border-radius: 50%;
  display: inline-block;

  overflow: hidden;

  span {
    /*display: inline-block;*/
    padding-top: calc(50% - 8pt);
    width: 100%;
    height: 100%;
    text-align: center;
    user-select: none;
  }

  &.interactive:hover {
    background-color: #bbb;
    cursor: pointer;
  }

  &.highlighted {
    background-color: white;
  }
}
</style>
