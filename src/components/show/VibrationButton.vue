<template>
  <button @click="click" class="vibration-button" :disabled="disabled">
    <slot />
  </button>
</template>

<script>
export default {
  name: "vibration-button",
  components: {},

  props: ["disabled"],

  methods: {
    click: function () {
      navigator.vibrate =
        navigator.vibrate ||
        navigator.webkitVibrate ||
        navigator.mozVibrate ||
        navigator.msVibrate ||
        null;
      if (navigator.vibrate) {
        navigator.vibrate(80);
      }
    },
  },
};
</script>

<style lang="scss">
button.vibration-button {
  border-radius: 10px;
  outline: none !important;
  font-size: 24pt;
  cursor: pointer;

  background-color: #ddd;

  &:hover {
    background-color: #eee;
  }

  &:disabled {
    cursor: default;
    background-color: #ddd;
  }

  &.pressed {
    box-shadow: inset 3px 3px 18px #000;
  }
}
</style>
