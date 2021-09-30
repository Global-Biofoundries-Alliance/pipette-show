const Dotenv = require('dotenv-webpack');
const LicenseWebpackPlugin = require('license-webpack-plugin').LicenseWebpackPlugin;

module.exports = {	  
  lintOnSave: false,

  configureWebpack: {
    plugins: [
	new Dotenv(),
    new LicenseWebpackPlugin({outputFilename: 'licenses.html',
perChunkOutput: false, addBanner: true,
            renderBanner: (filename, modules) => {
                return '/*! licenses are at ' + filename + '*/';
            },
renderLicenses: (modules) => {
    let out = "<html><head></head><body>\n\n";
        out += "\n<h1> THIRD PARTY SOFTWARE </h1>\n";
        for (let i in modules) {
       out += "\n<h2>" + modules[i].packageJson.name + "(" + modules[i].packageJson.version + ")" +   "</h2 >\n";
       out += "\n<p>" + modules[i].licenseId +"</p>\n";
       out += "\n<pre>" + modules[i].licenseText +"</pre><br>\n";
    }
    out += "\n</body>";
    return  out;
  }
})
  ]
  }


};
