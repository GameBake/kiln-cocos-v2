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
    const fs = require('fs');
    const path = require('path');
    
    const androidAssetPath = "/build-templates/jsb-link/frameworks/runtime-src/proj.android-studio/app/src/main/assets";
  
    const kilnSettingsPath = path.join(Editor.Project.path, '/assets/resources/kiln/kilnSettings.json');
    const settings = JSON.parse(fs.readFileSync(kilnSettingsPath, 'utf8'));

    // Generate Kiln Definitions
    const kilnDefinitions = {
        ads: {
            interstitial: {},
            banner: {},
            rewarded: {}
        },
        events: {},
        leaderboards: {},
        iap: {}
    }
    for (let i = 0; i < settings.interstitials.length; i++) {
        let id = settings.interstitials[i];
        kilnDefinitions.ads.interstitial[id] = id;
    }
    for (let i = 0; i < settings.rewarded.length; i++) {
        let id = settings.rewarded[i];
        kilnDefinitions.ads.rewarded[id] = id;
    }
    for (let i = 0; i < settings.banners.length; i++) {
        let id = settings.banners[i];
        kilnDefinitions.ads.banner[id] = id;
    }
    for (let i = 0; i < settings.events.length; i++) {
        let id = settings.events[i];
        kilnDefinitions.events[id] = id;
    }
    for (let i = 0; i < settings.leaderboards.length; i++) {
        let l = settings.leaderboards[i];
        kilnDefinitions.leaderboards[l.id] = l;
    }
    for (let i = 0; i < settings.iaps.length; i++) {
        let iap = settings.iaps[i];
        kilnDefinitions.iap[iap.id] = iap;
    }
    
    const file = path.join(Editor.Project.path, androidAssetPath, 'kiln-definitions-development.json');
    fs.writeFile(file, JSON.stringify(kilnDefinitions), (err) => {
        if (err) Editor.error(err);
        else Editor.success('Kiln Development Definitions created');
    });

    callback();
}

/**
 * We hook up to this stage of the build pipeline to add the kilnCocosBridge to the Android Project
 * if it's not there already
 * @param {*} options 
 * @param {*} callback 
 */
function onBeforeBuildFinish(options, callback) {
    const fs = require('fs');
    const path = require('path');

    const gradleSettingsPath = path.join(Editor.Project.path, "/build/jsb-link/frameworks/runtime-src/proj.android-studio/settings.gradle");

    try {
        var kilnLibrarySettings = "include ':kilnCocosBridge'";
        
        var data = fs.readFileSync(gradleSettingsPath, 'utf8')
        
        // Check if settings.gradle has kilnCocosBridge added to it
        if (data.match(/kilnCocosBridge/) === null) {
            Editor.log("Adding kilnCocosBridge to settings.gradle");

            // Add kilnCocosBridge
            data = `${kilnLibrarySettings}\n${data}`;
            
            fs.writeFile(gradleSettingsPath, data, (err) => {
                if (err) Editor.error(err);
                else Editor.success('kilnCocosBridge added to settings.gradle');
            });
        }
        else {
            Editor.log("kilnCocosBridge present in settings.gradle");
        }
    }
    catch (err) {
        Editor.error(err)
    }

    callback();
}


module.exports = {
    load() {
        Editor.Builder.on('build-start', onBuildStart);
        Editor.Builder.on('before-change-files', onBeforeBuildFinish);
    },

    unload() {
        Editor.Builder.removeListener('build-start', onBuildStart);
        Editor.Builder.removeListener('before-change-files', onBeforeBuildFinish);
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