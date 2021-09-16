#!/usr/bin/env node

const yargs = require('yargs');
const fs = require('fs');

const importPedigree = require('./import.js');
const exportPedigree = require('./export.js');
const Pedigree = require('./model.js');


const argv = yargs
  .command('import',
    'Convert from a non-standard format into GA4GH pedigree',
    {
      from: {
        description: 'Input format',
        choices: ['ped', 'boadicea', 'gedcom'],
        demandOption: true,
      },
    },
    function(argv) {
      var pedigree = null;
      // Read stdin into single string
      var input = fs.readFileSync(0, 'utf-8');

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
      console.log(JSON.stringify(pedigree.toJSON()));
    })
  .command('export',
    'Export from GA4GH pedigree into a non-standard format',
    {
      to: {
        description: 'Output format',
        choices: ['ped'],
        demandOption: true,
      },
    },
    function(argv) {
      // Read stdin into single string
      var input = fs.readFileSync(0, 'utf-8');

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
