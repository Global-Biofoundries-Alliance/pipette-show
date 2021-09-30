<template>
	<div uk-grid>
		<div class="uk-width-4-5@m">
			<regular-grid-plate
				:cols="plateProperties.cols"
				:show-labels="true"
				:rows="plateProperties.rows"
				v-slot="slotProps"
			>
				<pie-chart
					:values="values[slotProps.wellId]"
					:labels="labels"
					:colors="colors"
					:key="slotProps.wellId"
					class="summary-well"
					v-if="showWell[slotProps.wellId]"
				/>
                
                <pie-chart
					:values="[100]"
					:labels="['']"
					:colors="['#f4f4f4']"
					:key="empty"
					class="summary-well"
					v-else
				/>
                
			</regular-grid-plate>
		</div>
		<div class="uk-width-1-5@m">
			<h3 class="uk-h3">Legend</h3>
			<ul class="uk-list">
				<li class="wells-summary-legend-item" v-for="(s, i) in substances" :key="i">
					<div
						class="color-hint"
						:style="{ 'background-color': s.color }"
					></div>
					{{ s.name }}
				</li>
				<li class="wells-summary-legend-item">
					<div class="color-hint" style="background-color: #eee"></div>
					Empty
				</li>
			</ul>
		</div>
	</div>
</template>

<script>
import clone from "clone";

import RegularGridPlate from "../common/RegularGridPlate.vue";
import PieChart from "./PieChart.vue";

export default {
	name: "wells-summary",

	components: { RegularGridPlate, PieChart },

	computed: {
		plateProperties: function () {
			return this.$store.state.build.plate.dimensions;
		},

		substances: function () {
			return clone(this.$store.state.build.file.substances);
		},

		labels: function () {
			var names = [];
			for (var i = 0; i < this.substances.length; i++) {
				names[i] = this.substances[i].name;
			}			

			return names;
		},

		colors: function () {
			var colors = [];
			for (var i = 0; i < this.substances.length; i++) {
				colors[i] = this.substances[i].color;
			}

			return colors;
		},

		//values[well][substance]
		values: function () {
			let vals = clone(this.$store.state.build.file.values);

			//Find largest well volume
			let max = 0;
			for(let i = 0; i < vals.length; i++)
			{
				let sum = 0;
				for(let x = 0; x < vals[i].length; x++)
				{
					sum += vals[i][x];					
				}			

				if(sum > max)
					max = sum;	
			}

			//Append empty volume to all wells			
			for(let i = 0; i < vals.length; i++)
			{
				let sum = 0;
				for(let x = 0; x < vals[i].length; x++)
				{
					sum += vals[i][x];					
				}			

				vals[i].push(max - sum);
			}

			return vals;
		},

		//Determines if the well has ANY contents
		showWell: function () {
			var showWell = [];

			//for each well
			for (var w = 0; w < this.values.length; w++) {
				var vals = this.values[w];

				var isEmpty = true;
				for (var s = 0; s < vals.length; s++) {
					if (vals[s] > 0) {
						isEmpty = false;
						break;
					}
				}

				showWell[w] = !isEmpty;
			}

			return showWell;
		},

		changeAmount: function () {
			return this.$store.state.build.changeAmount;
		},
	},
};
</script>

<style lang="scss" scoped>
.summary-container {
	display: flex;
}

.wells-summary {
	width: 570px;
	height: 380px;
}

.summary-well {
	width: 100%;
	height: 100%;

	float: left;
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
	margin-right: 5px;
}

.legend {
	margin-left: 30px;
	margin-top: 18px;

	ul {
		list-style: none;
		padding-left: 0px;
	}
}

.wells-summary-legend-item
{
	white-space: nowrap;
}
</style>
