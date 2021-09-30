<template>
  <div id="show-divider" @click="navigateBack">    
  </div>
</template>

<script>
export default {
  name: "show-divider",
};
</script>

<style lang="scss">
#show-divider {
  height: 15px;
  width: 100%;
  box-sizing: border-box;
  text-align: center;

  background: linear-gradient(0, #222, #444, #222);

  flex: 0 0 auto;

  user-select: none;

  h1 {
    color: #ccc;
    font-size: 24pt;
    margin: auto;
    margin-top: 11px;
    height: 100%;
    line-height: 40px;
  }
}
</style>
