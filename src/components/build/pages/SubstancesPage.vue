<template>
  <div class="uk-container uk-margin-large-top uk-margin-bottom" uk-overflow-auto>
    <div class="uk-flex uk-flex-center">
      <div
        uk-scrollspy="cls: uk-animation-fade;"
        class="uk-card uk-card-default"
      >
        <div class="uk-card-header">
          <h2 class="uk-card-title serifs">Substances</h2>
        </div>
        <div class="uk-card-body">
          <form>
            <draggable
              class="uk-list"
              v-model="substances"
              group="substances"
              @end="finalizeDragging"
              item-key="id"
              tag="ul"
              handle=".drag-indicator"
            >
              <template #item="{ index, element }">
                <li class="substance">
                  <div class="drag-indicator">
                    <font-awesome-icon icon="arrows-alt-v" />
                  </div>
                  <input
                    class="color-picker uk-hidden"
                    :ref="'picker_' + index"
                    type="color"
                    @change="updateColor(index, $event)"
                    :value="element.color"
                  />
                  <div
                    class="color-indicator"
                    @click="$refs['picker_' + index].click()"
                    :style="{ 'background-color': element.color }"
                  ></div>
                  <input
                    class="name uk-input"
                    :value="element.name"
                    @input="updateNameAndColor(index, $event)"
                  />
                  <div class="remove-button" @click="removeSubstance(index)">
                    <font-awesome-icon icon="trash-alt" />
                  </div>
                </li>
              </template>
            </draggable>
          </form>

          <button
            class="uk-button uk-align-center uk-button-default add-button"
            @click="addSubstance"
          >
            <font-awesome-icon icon="plus" />
          </button>
        </div>

        <div class="uk-card-footer">
          <div>
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
      </div>
    </div>
  </div>
</template>

<script>
import { resortSubstances } from "../../../lib/SortableLib.js";
import { calcColor } from '../../../lib/ColorCalculator.js';
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import draggable from "vuedraggable";

export default {
  name: "substances-page",

  emits: ["continue", "back"],

  components: { FontAwesomeIcon, draggable },

  computed: {
    substances: {
      get: function () {
        return this.$store.state.build.file.substances;
      },

      set: function () {
        //Do Nothing! this is set via finalizeDragging.
      },
    },
  },

  methods: {
    addSubstance: function () {
      this.$store.commit("build/addSubstance", {
        name: "New substance",
        color: "#aaaaaa",
        computedColor: true,
      });

      let $el = this.$el;
      setTimeout(function () {
        let input = $el.querySelector(".substance:last-child input.name");
        input.focus();
        input.select();
      }, 1);
    },

    finalizeDragging: function (e) {
      //Shift index to represent gap instead of actual position to match the api of resortSubstances
      if (e.newIndex == e.oldIndex) return;
      let newIndex = e.newIndex;
      if (newIndex > e.oldIndex) newIndex++;
      let res = resortSubstances(this.$store, e.oldIndex, e.oldIndex, newIndex);
      this.$store.commit("build/setResortedSubstances", res);
    },

    removeSubstance: function (i) {
      this.$store.commit("build/removeSubstance", i);
    },

    updateColor: function (i, e) {
      this.$store.commit("build/updateSubstance", {
        index: i,
        value: {
          name: this.substances[i].name,
          color: e.target.value,
          computedColor: false,
        },
      });
    },

    updateNameAndColor: function (i, e) {
      let newColor = this.substances[i].computedColor
        ? calcColor(e.target.value)
        : this.substances[i].color;
      console.log("new color is: " + newColor);
      this.$store.commit("build/updateSubstance", {
        index: i,
        value: {
          name: e.target.value,
          color: newColor,
          computedColor: this.substances[i].computedColor,
        },
      });
    },    
  },
};
</script>

<style lang="scss">
.substance {
  display: flex;
  flex-direction: row;
  margin-bottom: 8px;

  .drag-indicator {
    width: 40px;
    height: 40px;
    flex: 0 0 auto;
    cursor: grab;
    svg {
      cursor: grab;
      padding: 10px;
      border-radius: 0px 3px 3px 0px;

      width: 100%;
      height: 100%;

      &:active {
        color: #ddd;
      }
    }
  }

  .color-picker {
    opacity: 0;
    width: 0px;
    height: 0px;
  }

  .color-indicator {
    flex: 0 0 auto;
    width: 24px;
    height: 24px;
    margin-right: 15px;
    margin-top: 6px;
    border-style: solid;
    border-width: 1px;
    border-radius: 3px;
    cursor: pointer;

    &:hover {
      box-shadow: inset #333 0px 0px 2px;
    }
  }

  .remove-button {
    width: 40px;
    height: 40px;
    flex: 0 0 auto;

    svg {
      cursor: pointer;
      padding: 10px;
      border-radius: 0px 3px 3px 0px;

      width: 100%;
      height: 100%;

      &:hover {
        background-color: #eee;
      }
    }
  }
}
</style>
