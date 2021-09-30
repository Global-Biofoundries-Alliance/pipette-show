<template>
  <router-view />
  <div id="modal"></div>
</template>

<style lang="scss">
/* Define custom style-overrides here! */

@import "../node_modules/uikit/src/scss/variables-theme.scss";
@import "../node_modules/uikit/src/scss/mixins-theme.scss";

@import "../node_modules/uikit/src/scss/uikit-theme.scss";

@font-face {
  font-family: "AccanthisADFStdNo2-Regular";
  src: url("./assets/fonts/AccanthisADFStdNo2-Regular.woff2") format("woff2"),
    url("./assets/fonts/AccanthisADFStdNo2-Regular.woff") format("woff"),
    url("./assets/fonts/AccanthisADFStdNo2-Regular.ttf") format("truetype");
}
body {
  background-color: #f4f4f4;
  overflow: hidden;
}

html,
html body,
html body div#show-activity,
html body div#show-activity div {
  touch-action: none;
}

.serifs {
  font-family: "AccanthisADFStdNo2-Regular";
}

#app {
  overflow: auto;

  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

button.icon-button {
  svg {
    float: left;
    transform: translate(-14px, 11px);
  }
}
</style>
