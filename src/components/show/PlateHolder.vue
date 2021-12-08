<template>
  <div id="plate-holder" @contextmenu.stop.prevent="ignore">
    <div
      :class="plasticClass"
      id="margin-top"
      :style="{ height: platePosition.top + 'px' }"
    ></div>
    <div
      id="plate-layer"
      :style="{ height: platePosition.bottom - platePosition.top + 'px' }"
    >
      <div
        :class="plasticClass"
        id="margin-left"
        :style="{ width: platePosition.left + 'px' }"
      ></div>
      <div id="plate-handle-container" :class="{ resizing: resizing }">
        <div
          id="plate-container"
          @pointerdown="prepareLongPressCheck"
          @pointerup="abortLongPress"
          @dblclick="startPlateResizing"
        >
          <slot />
        </div>

        <div v-if="resizing" id="handle-container">
          <svg
            draggable="false"
            data-position="tl"
            class="resize-handle"
            @pointerdown="dragResizeHandle"
            viewBox="0 0 50 50"
            style="left: 0px; top: 0px"
          >
            <polygon draggable="false" points="0,0 50,0 0,50" />
          </svg>
          <svg
            draggable="false"
            data-position="tr"
            class="resize-handle"
            @pointerdown="dragResizeHandle"
            viewBox="0 0 50 50"
            style="right: 0px; top: 0px"
          >
            <polygon draggable="false" points="0,0 50,50 50,0" />
          </svg>
          <svg
            draggable="false"
            data-position="c"
            class="move-handle"
            @pointerdown="dragResizeHandle"
            viewBox="0 0 50 50"
            style="margin-left: auto; margin-right: auto;margin-top: auto; margin-bottom: auto;"
          >
            <circle draggable="false" r="20" cx="25" cy="25" />
          </svg>
          <svg
            draggable="false"
            data-position="bl"
            class="resize-handle"
            @pointerdown="dragResizeHandle"
            viewBox="0 0 50 50"
            style="left: 0px; bottom: 0px"
          >
            <polygon draggable="false" points="0,0 0,50 50,50" />
          </svg>
          <svg
            draggable="false"
            data-position="br"
            class="resize-handle"
            @pointerdown="dragResizeHandle"
            viewBox="0 0 50 50"
            style="right: 0px; bottom: 0px"
          >
            <polygon draggable="false" points="50,0 50,50 0,50" />
          </svg>
        </div>
      </div>
      <div
        :class="plasticClass"
        id="margin-right"
        :style="{ width: 'calc(100% - ' + platePosition.right + 'px)' }"
      ></div>
    </div>
    <div :class="plasticClass" id="margin-bottom"></div>
  </div>
</template>
<script>
import clone from "clone";

export default {
  name: "plate-holder",
  props: ["physical-plate-properties", "instruction-type"],

  data: function () {
    return {
      platePosition: {
        left: 0,
        top: 0,
        right: 0, //Position of the right border, measured from LEFT
        bottom: 0, //Position of the bottom border, measured from the TOP
      },

      draggingStartPosition: undefined,

      longPressTimer: undefined,
    };
  },

  mounted: function () {
    let thi = this;
    this.platePosition = clone(this.$store.state.show.platePosition);

    //Auto-Size plate if the size is invalid
    this.$nextTick(function () {
      if (
        this.platePosition.right <= this.platePosition.left ||
        this.platePosition.bottom <= this.platePosition.top
      ) {
        thi.restoreDefaultPlateSize();
      }
    });

    //Listen for events
    this.$eventbus.on("restore-default-plate-size", function () {
      thi.restoreDefaultPlateSize();
    });

    this.$eventbus.on("abort-plate-size-change", function () {
      thi.platePosition = clone(thi.$store.state.show.platePosition);
    });
  },

  watch: {
    platePosition: {
      handler(val) {
        this.$store.commit("show/setPlatePosition", val);
      },
      deep: true,
    },
  },

  computed: {
    resizing: function () {
      return this.$store.state.show.resizing;
    },
    plasticClass: function () {
      return isNaN(this.instructionType) ? "warning" : "plastic";
    },
  },

  methods: {
    prepareLongPressCheck: function () {
      let thi = this;
      this.longPressTimer = setTimeout(function () {
        thi.startPlateResizing();
      }, 500);
    },

    abortLongPress: function () {
      clearTimeout(this.longPressTimer);
    },

    startPlateResizing: function () {
      this.$store.commit("show/startResizing");
    },

    restoreDefaultPlateSize: function () {
      let partWidthPixels = getSizeInPx(
        this.physicalPlateProperties.width / 10
      );
      let margin = (screen.width - partWidthPixels) / 2;
      let partHeightPixels = partWidthPixels * this.physicalPlateProperties.height / this.physicalPlateProperties.width;

      let platePosition = {};
      platePosition.top = 0;
      platePosition.left = margin;
      platePosition.right = margin + partWidthPixels;
      platePosition.bottom = partHeightPixels;

      this.platePosition = platePosition;

      console.log("Auto-Sizing:", this.platePosition);
    },

    dragResizeHandle: function (e) {
      this.draggingStartPosition = {
        x: e.screenX,
        y: e.screenY,
        handle: e.target.closest("svg").dataset.position,
      };

      document.addEventListener("pointermove", this.pointerMove);
      document.addEventListener("pointerup", this.pointerUp);
    },

    pointerMove: function (e) {
      let dx = e.screenX - this.draggingStartPosition.x;
      let dy = e.screenY - this.draggingStartPosition.y;

      let platePosition = this.platePosition;


      if (["tl", "bl","c"].includes(this.draggingStartPosition.handle))
        platePosition.left += dx;

      if (["tl", "tr","c"].includes(this.draggingStartPosition.handle))
        platePosition.top += dy;

      if (["tr", "br","c"].includes(this.draggingStartPosition.handle))
        platePosition.right += dx;

      if (["bl", "br","c"].includes(this.draggingStartPosition.handle))
        platePosition.bottom += dy;

      if (["c"].includes(this.draggingStartPosition.handle))
        {
        let plateWidth = platePosition.right-platePosition.left;
        let plateHeight = platePosition.bottom-platePosition.top;

          if (platePosition.top < 0) {
            platePosition.bottom = plateHeight;
            platePosition.top = 0;
          }

          if (platePosition.left < 0) {
            platePosition.right = plateWidth;
            platePosition.left = 0;
          }
          console.log(platePosition.right);
          if (window.innerWidth - platePosition.right < 0) {
            platePosition.left = window.innerWidth - plateWidth;
            platePosition.right = window.innerWidth;
          }
        }

      if (["bl","br","tl","tr"].includes(this.draggingStartPosition.handle))
        if (platePosition.top < 0) this.platePosition.top = 0;

      this.platePosition = platePosition;
      this.draggingStartPosition.x = e.screenX;
      this.draggingStartPosition.y = e.screenY;
    },

    pointerUp: function () {
      document.removeEventListener("pointermove", this.pointerMove);
      document.removeEventListener("pointerup", this.pointerUp);

      this.draggingStartPosition = undefined;
    },

    ignore: function () {
      return false;
    },
  },
};

//Converts cm to pixels as good as possible
function getSizeInPx(sizeInCm) {
  return (sizeInCm / 2.54) * (96 * window.devicePixelRatio);
}
</script>
<style lang="scss">
#plate-holder {
  flex: 0 0 auto;

  .plastic {
    background-color: #888;
  }

  .warning {
    background-color: #fbc9d3;
  }

  #margin-top {
    width: 100%;
  }

  #plate-layer {
    width: 100%;
    display: flex;
  }

  #margin-left {
    height: 100%;
  }

  #margin-right {
    height: 100%;
  }

  #margin-bottom {
    width: 100%;
    height: 40px;
  }

  #plate-handle-container {
    flex: 1 1 auto;
    position: relative;

    user-select: none;
    touch-action: none;

    text-align: center;
  }

  #handle-container {
    position: relative;
    width: 100%;
    height: 100%;

    display: flex;
    align-items: center;
    justify-content: center;

    //background-color: #00000088;
  }

  svg.resize-handle {
    position: absolute;
    height: 40%;
    min-height: 50px;
    max-height: 100px;

    polygon {
      cursor: pointer;
      fill: #ffcc66;
      stroke: black;
      stroke-width: 1;
    }
  }

  svg.move-handle {
    position: absolute;
    height: 40%;
    min-height: 50px;
    max-height: 100px;

    circle {
      cursor: pointer;
      fill: #bd2323;
      stroke: black;
      stroke-width: 1;
    }
  }

  #plate-container {
    position: absolute;
    top: 0px;
    left: 0px;
    right: 0px;
    bottom: 0px;
  }

  .save-button {
    background-color: #333;
    color: #ddd;
    border-style: solid;
    border-color: #888;
    padding: 9px;
    padding-left: 22px;
    padding-right: 22px;
    border-radius: 4px;
    cursor: pointer;

    &:hover {
      border-color: #88a;
      color: #ddf;
    }

    &:active {
      background-color: #222;
    }
  }
}
</style>
