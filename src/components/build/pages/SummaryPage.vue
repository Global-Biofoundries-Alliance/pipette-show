<template>
  <div class="uk-container uk-margin-large-top uk-margin-bottom">
    <div class="uk-flex uk-flex-center">
      <div
        uk-scrollspy="cls: uk-animation-fade;"
        class="uk-card uk-card-default"
      >
        <div class="uk-card-body">
          <ul uk-tab>
            <li><a href="#">Statistics</a></li>
            <li><a href="#">Well Overview</a></li>
            <li><a href="#">Instructions list</a></li>
          </ul>

          <ul class="uk-switcher uk-margin">
            <li>
              <div class="uk-grid-divider uk-child-width-1-2@s" uk-grid>
                <div class="">
                  <h3>Wells</h3>
                  <dl class="uk-description-list">
                    
                      <dt>Non-Empty wells:</dt>
                      <dd class="uk-padding-small">
                        {{ statistics.wells }}</dd>
                    
                      <dt>Smallest volume:</dt>
                      
                        <dd class="uk-padding-small">{{ statistics.smallestVolume }} {{ unit }}</dd>
                      
                      <dt>Largest Volume:</dt>
                     
                        <dd class="uk-padding-small">{{ statistics.largestVolume }} {{ unit }}</dd>
                  </dl>
                </div>
                <div class="">
                  <h3>Instructions</h3>
                  <dl class="uk-description-list">
                    
                      <dt>Substances</dt>
                      
                        <dd class="uk-padding-small">{{ statistics.substanceChanges }}</dd>
                      
                      <dt>Pipetting Operations</dt>
                      
                        <dd class="uk-padding-small">{{ statistics.pipetting }}</dd>
                      
                      <dt>Volume Changes</dt>
                     
                        <dd class="uk-padding-small">{{ statistics.volumeChanges }}</dd>
                      
                  </dl>
                </div>
              </div>
            </li>
            <li>
              <wells-summary />
            </li>
            <li>
              <div class="uk-overflow-auto uk-height-max-medium">
                <div
                  v-for="(row, e) in instructionsPerSubstance"
                  :key="e"
                >
                  <h3 class="uk-heading-xsmall">
                    {{ $store.state.build.file.substances[e].name }}
                  </h3>
                  <ul class="uk-list">
                    <li v-for="(v, i) in row" :key="i">
                      <span v-if="v.operation === 'volume'" class="uk-text-bold">
                        Set the volume to {{ v.value }} {{ unit }}.
                      </span>
                      <span v-else-if="v.operation === 'multichannelvolume'" class="uk-text-bold">
                        Set the multichannel-volume to {{ v.value }} {{ unit }}.
                      </span>
                      <span v-else-if="v.operation === 'substance'">
                        <!-- Can not happen here... -->
                      </span>
                      <span v-else>
                        <template v-if="isNaN(v.well)">
                        Put {{
                          $store.state.build.file.substances[v.substance].name
                        }} in wells 
                            <li v-for="i in v.well" :key="i">
                             {{ wellName(i)}}                            
                              </li>
                        </template>
                        <template v-else>                        
                        Put
                        {{
                          $store.state.build.file.substances[v.substance].name
                        }}
                        in well {{ wellName(v.well) }}.
                        </template>
                      </span>
                    </li>
                  </ul>
                </div>
              </div>
            </li>
          </ul>
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
import {
  makeInstructions,
  flattenedInstructions,
  wellStatistics,
} from "../../../lib/InstructionsLib.js";
import { getWellName } from "../../../lib/PlatesLib.js";

import WellsSummary from "../WellsSummary.vue";

export default {
  name: "summary-page",

  components: { WellsSummary },

  data: function () {
    return { unit: "µl" };
  },

  methods: {
    wellName: function (well) {
      console.log(well);
      return getWellName(this.$store.state.build.plate, well);
    },
  },

  computed: {
    //Flattens the complex sorted and grouped instruction-object into a one-dimensional instructions-array
    instructionsPerSubstance: function () {
      return makeInstructions(this.$store);
    },

    statistics: function () {
      let pipetting = 0;
      let volume = 0;
      let substance = 0;

      //Go Through all instructions
      let instructions = flattenedInstructions(this.$store);
      for (let i = 0; i < instructions.length; i++) {
        if (instructions[i].operation === "volume") {
          volume++;
        } else if (instructions[i].operation === "substance") {
          substance++;
        } else if (instructions[i].operation === undefined) {
          pipetting++;
        }
      }

      let res = wellStatistics(this.$store);

      return {
        volumeChanges: volume,
        pipetting: pipetting,
        substanceChanges: substance,
        wells: res.wells,
        largestVolume: (res.largestVolume).toFixed(4),
        smallestVolume: (res.smallestVolume).toFixed(4),
      };
    },
  },
};
</script>

<style>
</style>
