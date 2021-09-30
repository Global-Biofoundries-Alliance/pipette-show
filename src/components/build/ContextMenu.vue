<template>
  <teleport to="#modal">
    <ul class="context-menu" ref="menu" v-show="visible">
      <li v-for="m in menu" :key="m.label" @click="entryClicked(m)">
        {{ m.label }}
      </li>
    </ul>
  </teleport>
</template>

<script>
import { createPopper } from "@popperjs/core";

export default {
  name: "context-menu",

  props: ["menu"],

  data: function () {
    return { visible: false, parent: undefined };
  },

  methods: {
    show: function (anchor) {
      this.visible = true;
      this.parent = anchor;
      createPopper(anchor, this.$refs.menu, {
        placement: "bottom-start",
      });

      document.addEventListener("click", this.close);
    },

    close: function () {
      this.visible = false;
      this.parent = undefined;
      document.removeEventListener("click", this.close);
    },

    entryClicked: function (entry) {
      if (entry.click !== undefined) {
        entry.click(this.parent);
      }

      this.close();
    },
  },
};
</script>

<style lang="scss">
.context-menu {
  background-color: #fff;
  border-style: solid;
  border-width: 1px;
  border-color: #ccc;
  box-shadow: 1px 1px 2px #666;
  list-style: none;
  padding: 3px 0px;
  margin: 0px;

  li {
    padding-top: 2px;
    padding-bottom: 2px;
    padding-left: 26px;
    padding-right: 20px;
    font-size: 10pt;
    user-select: none;
  }

  li:hover {
    background-color: #ddd;
  }
}
</style>
