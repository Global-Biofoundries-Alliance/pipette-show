<script>
import { Pie } from "vue3-chart-v2";

export default {
	extends: Pie,

	props: ["labels", "colors", "values", "only-first-label"],

	data: function () {
		var thi = this;

		return {
			options: {
				legend: {
					display: false,
				},

				onClick: function (evt) {
					thi.$emit("click", evt);
				},

				animation: {
					duration: 0,
				},

				tooltips: false,
			},
		};
	},

	computed: {
		chartdata: function () {
			return {
				labels: this.labels,
				datasets: [
					{
						backgroundColor: this.colors,
						data: this.values,
                        borderWidth: 0,
					},
				],
			};
		},
	},

	watch: {
		colors: function () {
			this.renderChart(this.chartdata, this.options);
		},

		labels: function () {
			this.renderChart(this.chartdata, this.options);
		},

		values: function () {
			this.renderChart(this.chartdata, this.options);
		},

		onlyFirstLabel: function () {
			this.renderChart(this.chartdata, this.options);
		},
	},

	mounted() {
		this.renderChart(this.chartdata, this.options);
	},
};
</script>

<style></style>
