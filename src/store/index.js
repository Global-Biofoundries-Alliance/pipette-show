import { createStore } from "vuex";
import buildModule from "./build.js";
import showModule from "./show.js";
import createPersistedState from "vuex-persistedstate";

export default createStore({
	modules: {
		build: buildModule,
		show: showModule,
	},

	plugins: [createPersistedState()],
	strict: process.env.NODE_ENV !== "production",
});
