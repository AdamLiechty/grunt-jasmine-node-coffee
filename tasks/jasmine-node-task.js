module.exports = function (grunt) {
    'use strict';

    grunt.registerTask("jasmine_node", "Runs jasmine-node.", function() {
      var jasmine = require('jasmine-node');
      var util;
      var Path = require('path');
      var _ = grunt.util._;

      try {
          util = require('util');
      } catch(e) {
          util = require('sys');
      }

      var projectRoot     = grunt.config("jasmine_node.projectRoot") || ".";
      var specFolders     = grunt.config("jasmine_node.specFolders") || [];
      var source          = grunt.config("jasmine_node.source") || "src";
      var specNameMatcher = grunt.config("jasmine_node.specNameMatcher") || "spec";
      var teamcity        = grunt.config("jasmine_node.teamcity") || false;
      var useRequireJs    = grunt.config("jasmine_node.requirejs") || false;
      var extensions      = grunt.config("jasmine_node.extensions") || "js";
      var match           = grunt.config("jasmine_node.match") || ".";
      var matchall        = grunt.config("jasmine_node.matchall") || false;
      var autotest        = grunt.config("jasmine_node.autotest") || false;
      var useHelpers      = grunt.config("jasmine_node.useHelpers") || false;
      var forceExit       = grunt.config("jasmine_node.forceExit") || false;
      var useCoffee       = grunt.config("jasmine_node.useCoffee") || false;

      var isVerbose       = grunt.config("jasmine_node.verbose");
      var showColors      = grunt.config("jasmine_node.colors");

      if (projectRoot) {
        specFolders.push(projectRoot);
      }

      if (_.isUndefined(isVerbose)) {
        isVerbose = true;
      }

      if (_.isUndefined(showColors)) {
        showColors = true;
      }

      if (extensions.indexOf("coffee") !== -1) {
        try {
          require('coffee-script/register'); // support CoffeeScript >=1.7.0
        } catch ( e ) {
          require('coffee-script'); // support CoffeeScript <=1.6.3
        }
      }

      var junitreport = {
          report: false,
          savePath : "./reports/",
          useDotNotation: true,
          consolidate: true
      };

      var jUnit = grunt.config("jasmine_node.jUnit") || junitreport;

      // Tell grunt this task is asynchronous.
      var done = this.async();

      var regExpSpec = new RegExp(match + (matchall ? "" : specNameMatcher + "\\.") + "(" + extensions + ")$", 'i');
      var onComplete = function(runner, log) {
        var exitCode;
        util.print('\n');
        if (runner.results().failedCount === 0) {
          exitCode = 0;
        } else {
          exitCode = 1;

          if (forceExit) {
            process.exit(exitCode);
          }
        }

        done();
      };

      var options = {
        match:           match,
        matchall:        matchall,
        specNameMatcher: specNameMatcher,
        extensions:      extensions,
        specFolders:     specFolders,
        onComplete:      onComplete,
        isVerbose:       isVerbose,
        showColors:      showColors,
        teamcity:        teamcity,
        useRequireJs:    useRequireJs,
        coffee:          useCoffee,
        regExpSpec:      regExpSpec,
        junitreport:     jUnit
      };

      if (useHelpers) {
        jasmine.loadHelpersInFolder(projectRoot,
        new RegExp("helpers?\\.(" + extensions + ")$", 'i'));
      }

      try {
        // since jasmine-node@1.0.28 an options object need to be passed
        jasmine.executeSpecsInFolder(options);
      } catch (e) {
        console.log('Failed to execute "jasmine.executeSpecsInFolder": ' + e.stack);
      }
    });
};
