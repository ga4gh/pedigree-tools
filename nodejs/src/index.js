#!/usr/bin/env node

const yargs = require('yargs');
const fs = require('fs');

const importPedigree = require('./import.js');
const exportPedigree = require('./export.js');
const Pedigree = require('./model.js');

const readFileOrStdinSync = function(path) {
  // If '-', read from the file descriptor for stdin instead
  var inputFile = path === '-' ? 0 : path;

  // Read file into single string
  return fs.readFileSync(inputFile, 'utf-8');
}

const argv = yargs
  .command('import',
    'Convert from a non-standard format into GA4GH pedigree',
    function (yargs) {
      return yargs.option('from', {
        describe: 'Input format',
        choices: ['ped', 'boadicea', 'gedcom'],
        demandOption: true,
      }).option('file', {
        describe: 'Input file (- for stdin)',
        string: true,
        nargs: 1,
        demandOption: true,
      });
    },
    function(argv) {
      var pedigree = null;

      var input = readFileOrStdinSync(argv.file);
      if (input.length <= 0) {
        yargs.exit(1, 'Empty input');
      }

      // Import according to provided format
      if (argv.from === 'ped') {
        pedigree = importPedigree.initFromPED(input);
      } else if (argv.from === 'boadicea') {
        pedigree = importPedigree.initFromBOADICEA(input);
      } else if (argv.from === 'gedcom') {
        pedigree = importPedigree.initFromGEDCOM(input);
      }

      // Serialize to JSON output
      console.log(JSON.stringify(pedigree.toJSON(), null, 2));
    })
  .command('export',
    'Export from GA4GH pedigree into a non-standard format',
    function (yargs) {
      return yargs.option('to', {
        describe: 'Output format',
        choices: ['ped'],
        demandOption: true,
      }).option('file', {
        describe: 'Input file (- for stdin)',
        string: true,
        nargs: 1,
        demandOption: true,
      });
    },
    function(argv) {
      var input = readFileOrStdinSync(argv.file);
      if (input.length <= 0) {
        yargs.exit(1, 'Empty input');
      }

      var pedigreeJSON = JSON.parse(input);

      var pedigree = new Pedigree(pedigreeJSON);

      var output = '';
      if (argv.to === 'ped') {
        output = exportPedigree.exportAsPED(pedigree);
      }
      console.log(output);
    })
  .demandCommand()
  .help()
  .alias('help', 'h')
  .argv;