<template>
  <svg class="amount-indicator" viewBox="0 0 50 50" :style="style">
    <circle
      r="22"
      cx="25"
      cy="25"
      stroke="black"
      stroke-width="2"
      :fill="bgColor"
      class="inner-amount-indicator"
    />
    <text
      :fill="textColor"
      x="50%"
      y="50%"
      text-anchor="middle"
      dominant-baseline="central"
      style="font-size: 10pt; font-weight: bold"
    >
      <slot />
    </text>
  </svg>
</template>
<script>
export default {
  name: "amount-indicator",

  props: ["color", "style"],

  computed: {
    bgColor: function () {
      if (this.color === undefined) return "#bbb";

      return this.color;
    },

    textColor: function () {
      if (this.color === undefined) return "#000";

      if (lightOrDark(this.color)) return "#eee";

      return "#000";
    },
  },
};

function lightOrDark(color) {
  // Variables for red, green, blue values
  var r, g, b, hsp;

  // Check the format of the color, HEX or RGB?
  if (color.match(/^rgb/)) {
    // If RGB --> store the red, green, blue values in separate variables
    color = color.match(
      /^rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*(\d+(?:\.\d+)?))?\)$/
    );

    r = color[1];
    g = color[2];
    b = color[3];
  } else {
    // If hex --> Convert it to RGB: http://gist.github.com/983661
    color = +("0x" + color.slice(1).replace(color.length < 5 && /./g, "$&$&"));

    r = color >> 16;
    g = (color >> 8) & 255;
    b = color & 255;
  }

  // HSP (Highly Sensitive Poo) equation from http://alienryderflex.com/hsp.html
  hsp = Math.sqrt(0.299 * (r * r) + 0.587 * (g * g) + 0.114 * (b * b));

  // Using the HSP value, determine whether the color is light or dark
  if (hsp > 127.5) {
    return false;
  } else {
    return true;
  }
}
</script>
<style lang="scss">
.inner-amount-indicator {
  position: relative;
  display: inline-block;
  height: 100%;

  border-radius: 30px;

  border-color: #333;
  border-style: solid;
  border-width: 2px;
  box-shadow: 2px 1px 3px #666;

  background-color: #bbb;

  img {
    display: block;
    height: 100%;
    width: auto;
  }

  .text {
    position: absolute;
    top: 0px;
    left: 0px;
    margin-top: 20px;
    font-size: 14pt;
    color: #000;
  }

  .text.dark {
    color: #eee;
  }
}
</style>
