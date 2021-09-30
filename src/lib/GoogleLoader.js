/* global gapi */
function loadGAPIScript(gapiUrl) {
	return new Promise(function (resolve) {
		var script = document.createElement("script");
		script.src = gapiUrl;
		script.onreadystatechange = script.onload = function () {
			var interval = setInterval(function () {
				if (
					!script.readyState ||
					/loaded|complete/.test(script.readyState)
				) {
					clearInterval(interval);

					resolve(gapi);
				}
			}, 100);
		};
		document.getElementsByTagName("head")[0].appendChild(script);
	});
}

function fetchGoogleLibrary() {
	return loadGAPIScript("https://apis.google.com/js/api.js");
}

function loadGoogleApi(api, version) {
	return new Promise(function (resolve) {
		if (typeof version !== "undefined") gapi.load(api, version, resolve);
		else gapi.load(api, resolve);
	});
}

function loadClientApi(api, version) {
	return new Promise(function (resolve) {
		if (typeof version !== "undefined")
			gapi.client.load(api, version, resolve);
		else gapi.client.load(api, resolve);
	});
}

export { fetchGoogleLibrary, loadGoogleApi, loadClientApi };
