'use strict';

/**
 * Copies kilnSettings into the resources folder if it has not already been copied.
 * @param {*} silent 
 */
function initKilnSettings(silent = false) {
    const path = require('path');
    const packageResourcesPath = path.join(Editor.Project.path, "/packages/kiln/resources");

    if (!Editor.assetdb.exists('db://assets/resources/kiln/kilnSettings.json')) {
        Editor.assetdb.import([packageResourcesPath], 'db://assets', function (err, results) {
            if (err) {
                if (!silent) {
                    Editor.failed("Failed to copy Kiln Settings to resources folder");
                    Editor.error(err);   
                }
            }
            else {
                if (!silent) Editor.success("Kiln Settings copied to resources folder");
            }
        });
    }
    else {
        if (!silent) Editor.log("Kiln Settings already copied to resources folder");
    }
}

/**
 * Copies the android build template needed to the project if it has not already been copied
 * @param {*} silent 
 */
function initBuildTemplates(silent = false) {
    const fs = require('fs-extra');
    const path = require('path');

    const androidProjectPath = path.join(Editor.Project.path, "/build-templates/jsb-link/frameworks/runtime-src/proj.android-studio");
    const packageBuildTemplatePath = "/packages/kiln/android-template";

    if (!fs.existsSync(androidProjectPath)) {
        try {
            const srcPah = path.join(Editor.Project.path, packageBuildTemplatePath);
            const destPath = Editor.Project.path;
            
            fs.copySync(srcPah, destPath, { overwrite: true });

            if (!silent) Editor.success("Android template copied");
        }
        catch (err) {
            if (!silent) {
                Editor.failure("Failed to copy Android Template Copied");
                Editor.error(err);
            }
        }
    }
    else {
        if (!silent) Editor.log("Android template already copied");
    }
}

/**
 * Build Pipeline Start point. We'll generate Kiln JSON data that needs to be added to the build asset folder
 * @param {*} options 
 * @param {*} callback 
 */
function onBuildStart(options, callback) {
    const androidAssetPath = "/build-templates/jsb-link/frameworks/runtime-src/proj.android-studio/app/src/main/assets";

    const fs = require('fs');
    const path = require('path'); 
  
    // automatically create a folder after package loaded
    // fs.mkdirSync(Path.join(Editor.Project.path, 'myNewFolder'));
    // Editor.success('New folder created!');

    // let path = path.join(options.)

    Editor.log(Editor.Project.path);
    Editor.log(Editor.Project.path + androidAssetPath);
}

module.exports = {
    load() {
        // Editor.Builder.on('build-start', onBuildStart);
    },

    unload() {
        // Editor.Builder.removeListener('build-start', onBuildStart);
    },

    messages: {
        // Initialize plugin
        'initialize': function () {
            initKilnSettings();
            initBuildTemplates();
        },
        // Open up the Settings Panel
        'settings': function () {
            initKilnSettings(true);
            initBuildTemplates(true);

            const fs = require('fs');
            const path = require('path');

            const kilnSettingsPath = path.join(Editor.Project.path, '/assets/resources/kiln/kilnSettings.json');
            
            try {
                const settings = JSON.parse(fs.readFileSync(kilnSettingsPath, 'utf8'));
                Editor.Panel.open('kiln-plugin', settings);
            }
            catch (err) {
                Editor.error("Couldn't read Kiln Settings");
                Editor.error(err);
            }
        },
    },
};