<template>
  <div class="uk-container uk-margin-large-top uk-margin-bottom">
    <div class="uk-flex uk-flex-center">
      <div
        uk-scrollspy="cls: uk-animation-fade;"
        class="uk-card uk-card-default"
      >
        <div class="uk-card-header">
          <h2 class="uk-card-title serifs">Project properties</h2>
        </div>
        <div class="uk-card-body" style="min-width: 380px;">
          <form class="uk-form-stacked">
            <div class="uk-margin">
              <label class="uk-form-label" for="name-input">Project name</label>
              <div class="uk-form-controls">
                <input
                  v-model="bufferedFilename"
                  type="text"
                  class="uk-input"
                  id="name-input"
                  @keydown.enter="blurFilenameEditing"
                  @keydown.escape="abortFilenameEditing"
                  @blur="saveBufferedFilename"
                />
              </div>
            </div>

            <div class="uk-margin">
              <label class="uk-form-label" for="plate-selector">Plate</label>
              <div class="uk-form-controls">
                <select class="uk-select" id="plate-selector" v-model="plate">
                  <option v-for="p in plates" :key="p.name" :value="p.name">
                    {{ p.name }}
                  </option>
                </select>
              </div>
            </div>
           
            <div class="uk-margin">
              <label class="uk-form-label">Instructions</label>
              <div class="uk-form-controls">                
                <input class="uk-range" min="1" max="2" step="1" type="range" id="allow-splits" v-model.number="instructionsMode"/>                
                <div class="instruction-classes"><span @click="instructionsMode = 1">Simple</span><span @click="instructionsMode = 2">Advanced</span><!--<span @click="instructionsMode = 3">Expert</span>--></div>
                <br/>                

                <label class="uk-form-label moved-down" for="instructions-mode-description">{{instructionsModeName}}</label>
                <ul v-if="instructionsMode === 1">
                  <li>Pipette Substance to Substance, Well By Well</li>
                  <li>Slow, but simple</li>
                </ul>

                <ul v-else-if="instructionsMode === 2">
                  <li>Groups wells with the same volume</li>
                  <li>Does not always go well by well</li>
                  <li>Faster, but still easy to understand</li>
                </ul>

                <ul v-else-if="instructionsMode === 3">
                  <li>Groups wells with the same volume</li>
                  <li>Can split well volumes to reduce volume changes</li>
                  <li>Fastest, but might be confusing</li>
                </ul>                
              </div>
            </div>

			 <div class="uk-margin" v-if="plate === 'MWP 96' && instructionsMode === 2">
              <label class="uk-form-label">Use Multi-Channel Pipettes?</label>
              <div class="uk-form-controls">
                <label><input name="multi-channel" type="radio" :value="0" id="multi-channel-pipette-none" v-model="multiChannelPipettes" checked/>&nbsp;None</label><br/>
                <label><input name="multi-channel" type="radio" :value="8" id="multi-channel-pipette-8" v-model="multiChannelPipettes"/>&nbsp;8 Channels</label><br/>
                <label><input name="multi-channel" type="radio" :value="12" id="multi-channel-pipette-12" v-model="multiChannelPipettes"/>&nbsp;12 Channels</label>
              </div>
            </div>


          </form>
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
import plates from "../../../lib/PlatesLib.js";

export default {
  name: "properties-page",

  emits: ["continue", "back"],

  components: {},

  watch: {
    fileName: function () {
      this.bufferFilename();
    },
  },

  mounted: function () {
    this.bufferFilename();
  },

  data: function () {
    return { bufferedFilename: "", im: 2 };
  },

  computed: {
    instructionsMode:
    {
      get: function() {
        return this.$store.state.build.instructionsmode;
      },

      set: function(val) {
        this.$store.commit('build/setInstructionsMode', val);
      }
    },

    multiChannelPipettes:
    {
      get: function() {
        return this.$store.state.build.multichannelpipette;
      },

      set: function(val) {
        this.$store.commit('build/setMultiChannelPipette', val);
      }

    },

    instructionsModeName: function() {
      switch(this.instructionsMode)
      {
        case 1: return 'Simple Instructions';
        case 2: return 'Advanced Instructions';
        case 3: return 'Expert Instructions';
      }

      return undefined;
    },

    plates: function () {
      return plates;
    },

    fileName: function () {
      return this.$store.state.build.file.name;
    },

    allowSplits: {
      get: function() {
        return false;
      }      
    },

    plate: {
      get: function () {
        return this.$store.state.build.plate.name;
      },

      set: function (val) {
        this.$store.commit("build/changePlate", {
          plate: plates[val],
          silent: true,
        });
      },
    },
  },

  methods: {
    bufferFilename: function () {
      this.bufferedFilename = this.fileName;
    },

    blurFilenameEditing: function (evt) {
      evt.target.blur();
    },

    saveBufferedFilename: function () {
      this.$store.commit("build/setFileName", this.bufferedFilename);
    },

    abortFilenameEditing: function (evt) {
      this.bufferedFilename = this.fileName;
      evt.target.blur();
    },
  },
};
</script>

<style lang="scss">
  .instruction-classes
  {
    display: flex;
    justify-content: space-between;

    user-select: none;

    span
    {
      &:hover
      {
        color: #aaa;
        cursor: pointer;
      }
    }
  }

  .moved-down
  {
    transform: translate(0px, 10px);
  }
</style>
