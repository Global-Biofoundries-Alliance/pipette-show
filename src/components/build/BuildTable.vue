<template>
  <div class="page-content-container">
    <div class="scroll-container">
      <div class="handsontable" ref="handsontableRef"></div>
    </div>

    <context-menu ref="ctxMenu" :menu="contextMenu" />

    <modal-dialog v-model="showGradientDialog" title="Apply gradient">
      <table>
        <tr>
          <td style="text-align: right">Start value:</td>
          <td>
            <input type="number" step=".01" v-model="gradientStartValue" />
          </td>
        </tr>
        <tr>
          <td style="text-align: right">End value:</td>
          <td><input type="number" step=".01" v-model="gradientEndValue" /></td>
        </tr>
        <tr>
          <td colspan="2">
            <button @click="applyGradient" class="submit-button">Apply</button>
          </td>
        </tr>
      </table>
    </modal-dialog>
    <modal-dialog v-model="showFillDialog" title="Fill with substance">
      <table>
        <tr>
          <td style="text-align: right">Target volume:</td>
          <td><input v-model="fillSum" type="number" :min="minFillVolume" step=".01" /></td>
        </tr>
        <tr>
          <td colspan="2">
            <button @click="fillWithSubstance" class="submit-button">
              Apply
            </button>
          </td>
        </tr>
      </table>
    </modal-dialog>

    <div id="build-table-button-footer" class="uk-hidden@s">
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
  </div>
</template>

<script>
import clone from "clone";
import Handsontable from "handsontable";
import "handsontable/dist/handsontable.full.css";

import ModalDialog from "./ModalDialog.vue";
import ContextMenu from "./ContextMenu.vue";

import { getWellName } from "../../lib/PlatesLib.js";
import { resortSubstances } from "../../lib/SortableLib.js";

import { ref, watch, getCurrentInstance, nextTick } from "vue";
import { useStore } from "vuex";

export default {
  name: "build-table",

  components: { ContextMenu, ModalDialog },

  setup() {
    const internalInstance = getCurrentInstance();
    const $eventbus =
      internalInstance.appContext.config.globalProperties.$eventbus;
    const $store = useStore();
    const handsontableRef = ref(undefined);
    const ctxMenu = ref(undefined);

    //--------- column-header-selection-stuff ----------
    let isMouseSelection = false,
      columnHeaderSelected = ref(false),
      rowHeaderSelected = ref(false),
      handsontable = ref(undefined);

    watch(columnHeaderSelected, (val) => {
      $eventbus.emit("column-header-selected", val);
    });

    watch(rowHeaderSelected, (val) => {
      $eventbus.emit("row-header-selected", val);
    });

    let beforeOnTableCellMouseDown = function (_, coords) {
        if (coords.row === -1) {
          columnHeaderSelected.value = true;
        } else {
          columnHeaderSelected.value = false;
        }

        if (coords.col === -1) {
          rowHeaderSelected.value = true;
        } else {
          rowHeaderSelected.value = false;
        }

        //Don't deselect in afterSelection
        isMouseSelection = true;
      },
      afterSelection = function () {
        if (!isMouseSelection) {
          columnHeaderSelected.value = false;
          rowHeaderSelected.value = false;
        }

        isMouseSelection = false;
      },

      afterRender = function() {
        console.log("after render");
        initOnclickListeners();
      },


      afterDeselect = function () {
        columnHeaderSelected.value = false;
        rowHeaderSelected.value = false;
      };

    //------------- column-editing -------------

    let startColumnRenaming = function (columnHeader, substanceName) {
        let input = document.createElement("input"),
          th = columnHeader.closest("th"),
          rect = th.getBoundingClientRect(),
          blurClick = function () {
            input.blur();
          },
          addListeners = () => {
            input.addEventListener("keydown", (e) => {
              if (e.keyCode === 13) {
                e.target.blur();
              } else if (e.keyCode === 27) {
                e.target.value = substanceName;
                e.target.blur();
              }
            });

            input.addEventListener("blur", () => {
              const index = columnHeader.dataset.index * 1;
              var substance = clone($store.state.build.file.substances[index]);
              substance.name = input.value;
              $store.commit("build/updateSubstance", {
                index: index,
                value: substance,
              });

              setTimeout(() => {
                if (input.parentNode) input.parentNode.removeChild(input);
                document
                  .querySelector(".wtHolder")
                  .removeEventListener("click", blurClick);
              });
            });

            document
              .querySelector(".wtHolder")
              .addEventListener("click", blurClick);
          },
          appendInput = () => {
            input.setAttribute("type", "text");
            input.style.cssText =
              "" +
              "position:absolute;" +
              "left:" +
              rect.left +
              "px;" +
              "top:" +
              rect.top +
              "px;" +
              "width:" +
              (rect.width - 4) +
              "px;" +
              "height:" +
              (rect.height - 4) +
              "px;" +
              "z-index:1000;" +
              "text-align:center";
            document.body.appendChild(input);
          };

        input.value = substanceName;
        appendInput();

        setTimeout(() => {
          handsontable.value.deselectCell();

          addListeners();
          input.select();
        }, 1);
      },
      removeSelectedColumn = function () {
        var coords = handsontable.value.getSelectedLast();

        if (coords !== undefined) {
          /*if (
          !confirm(
            "Are you sure you want to delete the selected substance(s)?\r\nThis cannot be undone."
          )
        )
          return;*/

          let lowestCol = Math.min(coords[1], coords[3]);
          let highestCol = Math.max(coords[1], coords[3]);

          for (let i = highestCol; i >= lowestCol; i--) {
            $store.commit("build/removeSubstance", i);
          }
        }
      },
      addSubstance = function () {
        //TODO: add at index?!?

        $store.commit("build/addSubstance", {
          name: "New substance",
          color: "#aaaaaa",
        });
      },
      outSideClickDeselects = function (target) {
        if (target.matches(".tool, .tool *")) return false;
        if (target.matches(".context-menu, .context-menu *")) return false;
        if (target.matches(".uk-navbar-nav, .uk-navbar-nav *")) return false;

        return true;
      },
      beforeTableKeyDown = function (e) {
        //Column-Header-Operations
        var selectedColumn = document.querySelector("th.ht__active_highlight");
        if (selectedColumn !== null) {
          var header = selectedColumn.querySelector(":scope .column-header");
          if (header !== null) {
            //Remove
            if (e.keyCode === 46) {
              e.stopImmediatePropagation();

              //Remove the substance
              $store.commit("build/removeSubstance", header.dataset.index);
            }

            //Rename
            if (e.keyCode === 113) {
              let substanceName = header.querySelector(
                ":scope .substance-name"
              );
              startColumnRenaming(header, substanceName.innerHTML);
            }
          }
        }
      },
      beforeTableColumnMove = function (movedColumns, finalIndex) {
        //Calculate start end end index of moved data in the original array
        let startIndex = movedColumns[0];
        let endIndex = movedColumns[movedColumns.length - 1];

        let res = resortSubstances($store, startIndex, endIndex, finalIndex);

        //Save resorted substances
        nextTick(function () {
          $store.commit("build/setResortedSubstances", res);
        });

        return false;
      },
      initOnclickListeners = function () {
        //Go through All Column headers and set child listeners
        var columnHeaders = handsontableRef.value.getElementsByClassName(
          "column-header"
        );
        for (var i = 0; i < columnHeaders.length; i++) {
          let columnHeader = columnHeaders[i];

          //Color picker
          columnHeader
            .querySelector(":scope input")
            .addEventListener("change", function (e) {
              const index = columnHeader.dataset.index * 1;
              var substance = clone($store.state.build.file.substances[index]);
              substance.color = e.target.value;
              $store.commit("build/updateSubstance", {
                index: index,
                value: substance,
              });
            });

          //Substance name (renaming)
          let substanceName = columnHeader.querySelector(
            ":scope .substance-name"
          );
          substanceName.addEventListener("dblclick", function (evt) {
            evt.stopPropagation();
            evt.preventDefault();

            startColumnRenaming(columnHeader, substanceName.innerText);
          });
        }
      };

    //---------- Context-Menu -----------
    let beforeOnTableCellContextMenu = function (e) {
      e.preventDefault();
      e.stopImmediatePropagation();

      if (e.target.matches(".column-header *")) {
        ctxMenu.value.show(e.target);
      }
    };

    //--------- Tools ---------
    const showGradientDialog = ref(false);
    const showFillDialog = ref(false);

    let gradientStartValue = ref(0);
    let gradientEndValue = ref(0);
    let substanceWithDialog = ref(undefined);

    let fillSum = ref(0);
	let minFillVolume = ref(0);

    return {
      substanceWithDialog,
      gradientStartValue,
      gradientEndValue,
      fillSum,
	  minFillVolume,
      ctxMenu,
      handsontableRef,
      afterSelection,
      afterDeselect,
      afterRender,
      beforeOnTableCellMouseDown,
      startColumnRenaming,
      removeSelectedColumn,
      addSubstance,
      handsontable,
      beforeTableColumnMove,
      beforeTableKeyDown,
      outSideClickDeselects,
      initOnclickListeners,
      beforeOnTableCellContextMenu,
      showGradientDialog,
      showFillDialog,
    };
  },

  mounted: function () {
    this.handsontable = new Handsontable(
      this.$refs.handsontableRef,
      this.tableOptions
    );

    var thi = this;
    this.$eventbus.on("remove-substance", function () {
      thi.removeSelectedColumn();
    });

    this.$eventbus.on("add-substance", function () {
      thi.addSubstance();
    });

    this.$eventbus.on("clear-row-column", function () {
      var coords = thi.handsontable.getSelectedLast();

      if (coords !== undefined) {
        let data = clone(thi.tableData);
        for (let y = coords[0]; y <= coords[2]; y++) {
          for (let x = coords[1]; x <= coords[3]; x++) {
            data[y][x] = 0;
          }
        }

        thi.$store.commit("build/setValues", data);
      }
    });

    this.$eventbus.on("apply-gradient-for-substance", function () {
      var coords = thi.handsontable.getSelectedLast();

      if (coords !== undefined) {
        (thi.gradientStartValue = thi.tableData[coords[0]][coords[1]]),
          (thi.gradientEndValue = thi.tableData[coords[2]][coords[3]]);

        thi.substanceWithDialog = coords[1];

        thi.showGradientDialog = true;
      }
    });

    this.$eventbus.on("fill-substance", function () {
      var coords = thi.handsontable.getSelectedLast();
      if (coords !== undefined) {
        thi.substanceWithDialog = coords[1];

        //Find highest current volume in a well
        let highestSum = 0;
        for (let i = 0; i < thi.tableData.length; i++) {
          let row = thi.tableData[i];
          let sum = 0;
          for (let x = 0; x < row.length; x++) {
            sum += row[x];
          }

          if (sum > highestSum) highestSum = sum;
        }

        thi.fillSum = highestSum;
		thi.minFillVolume = thi.fillSum;
        thi.showFillDialog = true;
      }
    });

    this.initOnclickListeners();
  },

  beforeUnmount: function () {
    let allEvents = this.$eventbus.all;
    let arr = [
      "remove-substance",
      "add-substance",
      "apply-gradient-for-substance",
      "fill-substance",
    ];
    let thi = this;

    allEvents.forEach(function (value, key) {
      for (let i = 0; i < arr.length; i++) {
        if (key === arr[i]) {
          thi.$eventbus.off(arr[i], value[0]);
        }
      }
    });
  },

  watch: {
    tableData: function () {
      this.$nextTick(function () {
        this.handsontable.loadData(this.tableData);
      });
    },

    tableMetaDataHash: function () {
      this.updateTableOptions();
    },
  },

  /*
      beforePaste: (data, coords) => {
        //Title insertion is enabled only if insert coordinates are in the first row
        if(coords[0].startRow == 0)
        {
    //Use title insertion if the first element is not numeric
    if(!isNumeric(data[0][0]))
    {
      //Remove headers from data
      var headers = data.splice(0, 1);

      //Save headers
      this.setSubstanceName(coords[0].startCol, headers[0]);

      //TODO: Remove old cols??
      // Remove old rows??
    }
        }
      }*/

  //TODO: Always remove data that overlaps the allowed area?!?

  computed: {
    contextMenu: function () {
      var thi = this;

      return [
        {
          label: "Rename",
          click: function (e) {
            let header = e.closest(".column-header");
            let substanceName = header.querySelector(":scope .substance-name");
            thi.startColumnRenaming(header, substanceName.innerHTML);
          },
        },
        { label: "Remove", click: () => this.removeSelectedColumn() },
      ];
    },

    tableOptions: function () {
      return {
        outsideClickDeselects: this.outSideClickDeselects,
        manualColumnMove: true,

        columns: this.tableColumns,
        colHeaders: this.substanceHeaders,
        rowHeaders: this.wellHeaders,
        data: this.tableData,

        afterChange: this.afterTableChange,
        beforeColumnMove: this.beforeTableColumnMove,
        beforeKeyDown: this.beforeTableKeyDown,
        beforeOnCellMouseDown: this.beforeOnTableCellMouseDown,
        afterSelection: this.afterSelection,
        afterDeselect: this.afterDeselect,
        beforeOnCellContextMenu: this.beforeOnTableCellContextMenu,
        afterRender: this.afterRender,

        /*numericFormat: {
          pattern: "0.00",
          culture: "en-US",
        },*/
      };
    },

    tableData: function () {
      var data = clone(this.$store.state.build.file.values);
      return data;
    },

    tableMetaDataHash: function () {
      var hash = "";
      for (var i = 0; i < this.$store.state.build.file.substances.length; i++) {
        hash +=
          this.$store.state.build.file.substances[i].color +
          this.$store.state.build.file.substances[i].name;
      }
      return hash;
    },

    tableColumns: function () {
      let ret = [];
      for (let i = 0; i < this.$store.state.build.file.substances.length; i++) {
        ret.push({ type: "numeric" });
      }

      return ret;
    },
  },

  methods: {
    substanceHeaders: function (col) {
      let substance = this.$store.state.build.file.substances[col];
      return this.makeSubstanceHeader(substance, col);
    },

    makeSubstanceHeader: function (substance, index) {
      let description =
        substance.description !== undefined
          ? substance.description
          : substance.name;
      return `<span data-index="${index}" class="column-header" title="${description}"><div class="color-hint" style="background-color: ${substance.color}"><input type="color" class="color-changer" name="body" value="${substance.color}"/></div>&nbsp;<span class="substance-name">${substance.name}</span></span>`;
    },

    wellHeaders: function (wellId) {
      return getWellName(this.$store.state.build.plate, wellId);
    },

    updateTableOptions: function () {
      this.handsontable.updateSettings(this.tableOptions);

      var thi = this;
      setTimeout(function () {
        thi.initOnclickListeners();
      }, 1);
    },

    afterTableChange: function (change, source) {
      if (source === "loadData") {
        return; //don't save this change
      }

      for (var i = 0; i < change.length; i++) {
        var ch = change[i]; //

        this.$store.commit("build/updateValue", ch);
      }
    },

    fillWithSubstance: function () {
	  if(this.fillSum < this.minFillVolume)
	  {
		alert('Error filling wells: The given volume is smaller than the largest current well-volume!');		
		return;
	  }
		
      let data = clone(this.tableData);

      for (let y = 0; y < data.length; y++) {
        let row = data[y];
        let sum = 0;
        for (let x = 0; x < row.length; x++) {
          if (x !== this.substanceWithDialog) {
            sum += row[x];
          }
        }

        if (sum !== 0) {
          data[y][this.substanceWithDialog] = Number(
            (this.fillSum - sum).toFixed(2)
          );
        }
      }

      this.showFillDialog = false;
      this.$store.commit("build/setValues", data);
    },

    applyGradient: function () {
      let data = clone(this.tableData);

      let incr =
        (this.gradientEndValue * 1 - this.gradientStartValue * 1) /
        (data.length - 1);
      let sum = this.gradientStartValue * 1;
      for (let i = 0; i < data.length; i++) {
        data[i][this.substanceWithDialog] = Number(sum.toFixed(1));
        sum += incr;
      }

      this.showGradientDialog = false;
      this.$store.commit("build/setValues", data);
    },
  },
};
</script>

<style>


.build-page {
    min-height: 0px;
}

.build-page-inner {
    min-height: 0px;
}

.page-content-container {
    min-height: 0px;
}


.page-content-container {
  flex: 1 1 auto;
  display: flex;
  flex-direction: column;
}

.scroll-container {
  overflow: hidden;
  flex: 1 1 auto;
  background-color: #fff;
}

.handsontable {
  /* Hide top-border */
  transform: translate(0px, -1px);
}

.color-hint {
  position: relative;
  display: inline-block;
  width: 12px;
  height: 12px;
  background-color: white;

  border-style: solid;
  border-color: black;
  border-width: 1px;
  border-radius: 3px;
  transform: translate(0px, 2px);
}

.color-changer {
  opacity: 0;
  padding: 0px;
  width: 12px;
  height: 12px;
  position: absolute;
  left: -1px;
  top: -1px;
}

.vfm__content {
  background-color: #ffffff;
}
</style>
