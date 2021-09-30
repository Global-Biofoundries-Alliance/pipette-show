<template>
  <input
    type="file"
    ref="uploader"
    class="uploader"
    :accept="accept"
    @change.prevent.stop="fileSelected"
  />
</template>

<script>
import { rawFileUploaded } from "../../lib/IOLib.js";

export default {
  name: "hidden-file-uploader",

  props: ["target"],

  data: function () {
    return { accept: ".pip", afterLoaded: undefined };
  },

  methods: {
    fileSelected: async function (evt) {
      if (evt.target.files.length === 0) return;

      var file = evt.target.files[0];      
      if (file) {
        rawFileUploaded(this.$store, file, this.target, this.afterLoaded);
      }

      this.$refs["uploader"].value = "";
    },

    show: function (accept, afterLoaded) {
      this.accept = accept;
      this.afterLoaded = afterLoaded;

      this.$nextTick(function () {
        this.$refs.uploader.click();
      });
    },
  },
};
</script>

<style scoped>
.uploader {
  width: 1px;
  height: 1px;
  opacity: 0;
}
</style>
