<template>
  <header class="uk-navbar-container uk-box-shadow-medium">
    <nav class="uk-container" uk-navbar style="max-width: 100%;">

      <ul id="build-navigation"  class="uk-navbar-item">
        <li class="finished" style="flex: 0 0 30px" @click="returnToHome">
          <font-awesome-icon icon="home" />
        </li>
        <li
          v-for="(page, i) in menu"
          :key="page.caption"
          @click="$emit('update:modelValue', page.page)"
          :class="{
            finished: currentStepIndex > i,
            active: page.page === modelValue,
            caption: true,
          }"
        >
          {{ page.caption }}
        </li>
      </ul>

    </nav>
  </header>
</template>

<script>
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

export default {
  name: "build-navigation",

  components: { FontAwesomeIcon },

  props: ["modelValue"],
  emits: ["update:modelValue"],

  mounted: function () {
    document.addEventListener("keydown", this.keydown);
  },

  unmounted: function () {
    document.removeEventListener("keydown", this.keydown);
  },

  data: function () {
    return {
      menu: [
        { page: "start", caption: "Start" },
        { page: "properties", caption: "Project properties" },
        { page: "substances", caption: "Substances" },
        { page: "wells", caption: "Well contents" },
        { page: "summary", caption: "Summary" },
        { page: "export", caption: "Export" },
      ],
    };
  },

  computed: {
    currentStepIndex: function () {
      for (let i = 0; i < this.menu.length; i++) {
        if (this.menu[i].page === this.modelValue) {
          return i;
        }
      }

      return -1;
    },
  },

  methods: {
    returnToHome: function () {
      this.$router.push("/");
    },

    nextPage: function () {
      for (let i = 0; i < this.menu.length - 1; i++) {
        if (this.menu[i].page === this.modelValue) {
          this.$emit("update:modelValue", this.menu[i + 1].page);
        }
      }
    },

    lastPage: function () {
      for (let i = 1; i < this.menu.length; i++) {
        if (this.menu[i].page === this.modelValue) {
          this.$emit("update:modelValue", this.menu[i - 1].page);
        }
      }
    },

    keydown: function (e) {
      if (e.repeat) {
        return;
      }

      //Don't switch the page if an input is currently in focus
      if (document.activeElement.matches("input, select, textarea")) return;

      if (e.keyCode === 39) {
        this.nextPage();
      }

      if (e.keyCode === 37) {
        this.lastPage();
      }
    },
  },
};
</script>

<style lang="scss">
@import "../../../node_modules/uikit/src/scss/variables-theme.scss";
$bgColor: #ddd;
$hoverColor: #bbb;
$activeColor: $global-primary-background;
$finishedColor: darken($alert-primary-background, 8%);

#build-navigation {
  display: flex;
  flex-wrap: wrap;
  padding: 10px;
  row-gap:10px;
  width: 100%;
  margin: 0;
  color: $global-emphasis-color;
  list-style: none;
  text-align: center;

  li {
    background-color: $bgColor;

    flex: 1 1 auto;
    margin: 0px 20px 0px 20px;
    height: 40px;
    line-height: 40px;
    position: relative;
    cursor: pointer;
    min-width: 80px;
    font-size: 0.875rem;
    text-transform: uppercase;

    &.caption {
      white-space: nowrap;
    }

    &:before {
      content: "";
      position: absolute;
      /*left: -20px;*/
      right: 100%;
      width: 0px;
      height: 0px;
      border-style: solid;
      border-width: 20px 0 20px 20px;
      border-color: $bgColor $bgColor $bgColor transparent;
    }

    &:after {
      content: "";
      position: absolute;
      /*right: -20px;*/
      left: 100%;
      width: 0px;
      height: 0px;
      border-style: solid;
      border-width: 20px 0 20px 20px;
      border-color: transparent transparent transparent $bgColor;
    }

    &.finished {
      background-color: $finishedColor;

      &::before {
        border-color: $finishedColor $finishedColor $finishedColor transparent;
      }

      &::after {
        border-color: transparent transparent transparent $finishedColor;
      }
    }

    &:hover {
      background-color: $hoverColor;
      color: #fff;

      &::before {
        border-color: $hoverColor $hoverColor $hoverColor transparent;
      }

      &::after {
        border-color: transparent transparent transparent $hoverColor;
      }
    }

    &.active {
      background-color: $activeColor;
      color: #fff;

      &::before {
        border-color: $activeColor $activeColor $activeColor transparent;
      }

      &::after {
        border-color: transparent transparent transparent $activeColor;
      }
    }

    &:first-child {
      border-radius: 5px 0px 0px 5px;
      margin: 0px 20px 0px 0px;
      &:before {
        display: none;
      }

    }

    &:last-child {
      border-radius: 0px 5px 5px 0px;
      margin: 0px 0px 0px 20px;
      &:after {
        display: none;
      }
    }
  }
}
</style>
