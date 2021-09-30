<template>
  <div class="header">
    <menu-bar :menu="menu" />

    <div class="button-holder uk-visible@s">
      <button
        @click="$emit('back')"
        class="uk-button uk-margin-right uk-button-secondary"
      >
        Back
      </button>
      <button
        @click="$emit('continue')"
        class="uk-button uk-button-primary uk-margin-left uk-float-right"
      >
        Continue
      </button>
    </div>

    <div class="tool-bar">
      <hidden-file-uploader ref="uploader" />

      <div
        v-for="tool in tools"
        :key="tool.icon"
        @click="clickIfNotDisabled(tool)"
        :title="tool.title"
        :class="{
          divider: tool.divider,
          tool: !tool.divider,
          disabled: tool.disabled === true,
        }"
      >
        <font-awesome-icon v-if="!tool.divider" :icon="tool.icon" />
      </div>
    </div>
  </div>
</template>

<script>
import plates from "../../lib/PlatesLib.js";

import MenuBar from "./MenuBar.vue";
import HiddenFileUploader from "../common/HiddenFileUploader.vue";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import {
  downloadFile,
  pickGoogleDriveFile,
  saveToGoogleDrive,
  getTransferCode,
} from "../../lib/IOLib.js";

export default {
  name: "build-header",

  components: {
    MenuBar,
    HiddenFileUploader,
    FontAwesomeIcon,
  },

  data: function () {
    return {
      tableColumnSelected: false,
      tableRowSelected: false,
    };
  },

  emits: ["continue", "back"],

  mounted: function () {
    let thi = this;
    this.$eventbus.on("column-header-selected", function (isSelected) {
      thi.tableColumnSelected = isSelected;
    });

    this.$eventbus.on("row-header-selected", function (isSelected) {
      thi.tableRowSelected = isSelected;
    });
  },

  computed: {
    tools: function () {
      return [
        {
          title: "New File",
          icon: "file-medical",
          click: () => this.createNewfile(),
        },
        {
          title: "Upload File",
          icon: "cloud-upload-alt",
          click: () => this.$refs.uploader.show(".pip, .csv, .json"),
        },
        { divider: true },
        {
          name: "add",
          icon: "plus",
          title: "Add Substance",
          click: () => this.$eventbus.emit("add-substance"),
        },
        {
          name: "remove",
          icon: "trash-alt",
          title: "Remove substance",
          disabled: !this.tableColumnSelected,
          click: () => this.$eventbus.emit("remove-substance"),
        },
        { divider: true },
        {
          name: "clear",
          icon: "eraser",
          title: "Clear row/column",
          disabled: !this.tableColumnSelected && !this.tableRowSelected,
          click: () => this.$eventbus.emit("clear-row-column"),
        },
        {
          name: "gradient",
          icon: "signal",
          title: "Apply gradient",
          disabled: !this.tableColumnSelected,
          click: () => this.$eventbus.emit("apply-gradient-for-substance"),
        },
        {
          name: "fill",
          icon: "fill",
          title: "Back-fill with substance",
          disabled: !this.tableColumnSelected,
          click: () => this.$eventbus.emit("fill-substance"),
        },
        { divider: true },
        {
          name: "build",
          icon: "qrcode",
          title: "Create transfer code",
          click: () => this.getTransferCode(),
        },
      ];
    },

    menu: function () {
      let platesMenu = [];
      for (let p in plates) {
        let plate = plates[p];
        platesMenu.push({
          name: plate.name,
          label: plate.name,
          icon:
            this.$store.state.build.plate.name === plate.name
              ? "check"
              : undefined,
          click: () => this.selectPlate(plate.name),
        });
      }

      return {
        file: [
          {
            name: "new",
            icon: "file-medical",
            label: "New",
            click: () => this.createNewfile(),
          },
          {
            name: "upload",
            icon: "cloud-upload-alt",
            label: "Upload",
            click: () => this.$refs.uploader.show(".pip, .csv, .json"),
          },
          {
            name: "google-open",
            icon: ["fab", "google-drive"],
            label: "Open from Google Drive",
            click: () => pickGoogleDriveFile(this.$store, 'build'),
          },
          { divider: true },
          {
            name: "download",
            icon: "download",
            label: "Download",
            click: () => downloadFile(this.$store, "pip"),
          },
          {
            name: "drive",
            icon: ["fab", "google-drive"],
            label: "Save in Google Drive",
            click: () => this.saveToGoogleDrive(),
          },
          {
            name: "qrcode",
            icon: "qrcode",
            label: "Create transfer code",
            click: () => this.getTransferCode(),
          },
        ],

        tools: [
          {
            name: "clear",
            icon: "eraser",
            label: "Clear row/column",
            disabled: !this.tableColumnSelected,
            click: () => this.$eventbus.emit("clear-row-column"),
          },
          {
            name: "gradient",
            icon: "signal",
            label: "Apply gradient",
            disabled: !this.tableColumnSelected,
            click: () => this.$eventbus.emit("apply-gradient-for-substance"),
          },
          {
            name: "fill",
            icon: "fill",
            label: "Back-fill with substance",
            disabled: !this.tableColumnSelected,
            click: () => this.$eventbus.emit("fill-substance"),
          },
        ],
      };
    },
  },

  methods: {
    clickIfNotDisabled: function (tool) {
      if (tool.disabled !== true) {
        if (tool.click !== undefined) tool.click();
      }
    },

    getTransferCode: async function () {
      getTransferCode(this.$store, this.$eventbus);
    },

    returnToMainMenu: function () {
      this.$router.push("/");
    },

    createNewfile: function () {
      if (
        confirm(
          "Are you sure you want to create a new file?\r\nAny unsaved changes will be lost."
        )
      ) {
        this.$store.commit("build/createNewfile");
      }
    },

    selectPlate: function (plate) {
      this.$store.commit("build/changePlate", {
        plate: plates[plate],
        silent: false,
      });
    },

    showGoogleDrive: function () {
      window.open("https://drive.google.com/drive/my-drive", "_blank");
    },

    saveToGoogleDrive: async function () {
      saveToGoogleDrive(this.$store, this.$eventbus);
    },
  },
};
</script>

<style lang="scss">
.header {
  flex: 0 0 auto;
  position: relative;
}

.button-holder {
  position: absolute;
  right: 10px;
  top: 10px;
}

.file-img {
  width: 32px;
  height: 32px;
  margin: 12px;
  margin-top: 8px;
  cursor: pointer;
}

.document-name-bar {
  margin-left: 2px;

  input {
    margin-top: 17px;

    font-size: 18px;
    padding-top: 2px;
    padding-left: 8px;

    border-color: transparent;
    border-style: solid;
    border-width: 1px;
    border-radius: 3px;
  }

  &:hover {
    border-color: #ddd;
  }
}

.tool-bar {
  border-style: solid none;
  border-width: 1px;
  border-color: #ccc;
  height: 34px;
  display: flex;
  padding-left: 8px;

  background-color: #f8f8f8;
  padding: 5px 0px 3px 0px;

  .tool {
    padding: 5px 10px 10px 10px;
    cursor: pointer;

    &.disabled svg {
      color: #ddd;
    }

    svg {
      color: #999;
    }

    &:hover svg {
      color: #666;
    }

    &.disabled:hover {
      background-color: transparent;
      cursor: default;

      svg {
        color: #ddd;
      }
    }

    &:active {
      background-color: #ccc;

      svg {
        transform: translate(0px, 1px);
      }
    }

    &.disabled:active {
      background-color: transparent;

      svg {
        transform: translate(0px, 0px);
      }
    }
  }

  .divider {
    width: 0.5px;
    margin: 4px;
    background-color: #ccc;
  }
}
</style>
