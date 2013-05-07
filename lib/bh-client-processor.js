module.exports = {
    /**
     * Adapts single BH file content to client-side.
     * @param {String} input
     * @returns {String}
     */
    process: function (input) {
        return input
            .replace(/^\s*module\.exports\s*=\s*function\s*\([^\)]*\)\s*{/, '')
            .replace(/}\s*(?:;)?\s*$/, '');
    },

    /**
     * Adapts BH processor file content to client-side.
     * @param {String} input
     * @returns {String}
     */
    processBHEngineSource: function (input) {
        return input.replace(/module\.exports\s*=\s*BH\s*;/, '');
    },

    /**
     * Builds module (see npm package "ym").
     * @param {String} bhEngineSource
     * @param {String} inputSources
     * @param {Object} dependencies example: {libName: "dependencyName"}
     * @returns {string}
     */
    buildModule: function (bhEngineSource, inputSources, dependencies) {
        var libNames;
        var depNames;
        var libPrepares;
        if (dependencies) {
            libNames = Object.keys(dependencies);
            libPrepares = libNames.map(function (libName) {
                return 'bh.lib.' + libName + ' = ' + libName + ';';
            });
            depNames = libNames.map(function (libName) {
                return dependencies[libName];
            });
        }
        return 'modules.define(\'bh\''
            + (depNames ? ', ' + JSON.stringify(depNames) : '')
            + ', function(provide' + (libNames ? ', ' + libNames.join(', ') : '') + ') {\n'
            + bhEngineSource + '\n'
            + 'var bh = new BH();\n'
            + (libPrepares ? libPrepares.join('\n') + '\n' : '')
            + inputSources + '\n'
            + '});\n'
    },

    buildBEMHTMLMimic: function () {
        return 'modules.define(\'BEMHTML\', [\'bh\'], function(provide, bh) { provide(bh); });\n';
    }
};