<template>
	<plate-holder
		class="qr-scanner-container"
		:physical-plate-properties="plateProperties"
	>
		<video ref="videoplayer" class="videoplayer"></video>
	</plate-holder>
</template>

<script>
import PlateHolder from "./PlateHolder.vue";

import { finishScanning } from "../../lib/TransferCodeLib.js";

import QrScanner from "qr-scanner";
import QrScannerWorkerPath from "!!file-loader!../../../node_modules/qr-scanner/qr-scanner-worker.min.js";
QrScanner.WORKER_PATH = QrScannerWorkerPath;

export default {
	name: "show-qr-scanner",
	components: { PlateHolder },

	mounted: async function () {
		//Start webcam-stream
		this.scannerInstance = new QrScanner(this.$refs.videoplayer);
		await this.scannerInstance.start();

		//Create scan engine
		await QrScanner.createQrEngine(QrScanner.WORKER_PATH);

		//Start scanning
		setTimeout(this.scanImage, 1000);
		console.log("Searching for QR-Code...");
	},

	beforeUnmount: async function () {
		if (this.scannerInstance !== undefined) {
			await this.scannerInstance.stop();
			this.scannerInstance = undefined;
		}
	},

	data() {
		return { scannerInstance: undefined };
	},

	computed: {
		plateProperties: function () {
			return this.$store.state.show.plate.dimensions;
		},
	},

	methods: {
		scanImage: async function () {
			try {
				let res = await QrScanner.scanImage(this.$refs.videoplayer);
				if (res === undefined || res === null || res === "")
					setTimeout(this.scanImage, 500);
				else finishScanning(this.$store, res);
			} catch (_) {
				if (this.scannerInstance !== undefined)
					setTimeout(this.scanImage, 500);
			}
		},
	},
};
</script>

<style lang="scss">
.qr-scanner-container {
	color: #fff;

	.videoplayer {
		max-width: 100%;
		max-height: 100%;
		margin: auto;
	}

	canvas, img, video
	{
		height: 100%;
	}
}
</style>
