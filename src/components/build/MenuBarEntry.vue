<template>
  <a href="#" :disabled="m.disabled === true">
    <div
      :class="{ 'menu-entry': true, disabled: m.disabled }"
      @click="handleMenuSelection()"
    >
      <div class="menu-entry-icon">
        <font-awesome-icon v-if="m.icon !== undefined" :icon="m.icon" />
      </div>
      <div class="menu-entry-label">{{ m.label }}</div>
    </div>
  </a>
</template>

<script>
import UIkit from "uikit";

import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

export default {
  name: "menu-bar-entry",
  props: ["m", "k"],

  components: {
    FontAwesomeIcon,
  },

  methods: {
    handleMenuSelection: function () {
      if (this.m.click !== undefined && this.m.disabled !== true) {
        UIkit.toggle(document.querySelector("#menu_" + this.k));
        this.m.click();
      }
    },
  },
};
</script>

<style lang="scss">
.menu-entry {
  display: flex;

  .menu-entry-icon {
    flex: 0 0 20px;
    transform: translate(0px, 5px);
    text-align: center;
  }

  .menu-entry-label {
    flex: 1 1 auto;
    margin: 5px 15px;
  }

  &.disabled {
    color: #ddd;
  }
}
</style>
