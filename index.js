#!/usr/bin/env node

const ssi = require('ssi');
const chalk = require('chalk');
const rimraf = require('rimraf');
const program = require('commander');
const chokidar = require('chokidar');

const err = chalk.bold.red;
const msg = chalk.cyan;
const del = chalk.underline.red;
const file = chalk.underline.green;

let ssiTask;

// We override these so provide better error messaging
Object.assign(
  program,
  {
    missingArgument: function(name) {
      log(`Missing required argument ${err(name)}`, true);
      process.exit(1);
    },
    
    optionMissingArgument: function(option, flag) {
      log([
        `Missing option ${err(option.flags)} argument`, 
        flag && `, got ${err(flag)}`
      ].join(''), true);
      process.exit(1);
    }
  }
);

function log(message, error) {
  console.log((error ? err : msg)(`SSI:`), message);
};

function compile(source, target, files, echo = true) {
  echo && log(`Compiling ${file(source + files)} to ${file(target)}`);
  ssiTask.compile();
}

program
  .arguments('<source> <target> <files>')
  .option('-w, --watch <pattern>', 'Watch for changes and recompile if any')
  .option('-c, --clean [folder]', 'Delete the target directory before compiling')
  .option('-l, --loosened', 'Support loosened spacing in ssi directives')
  .action(function(source, target, files) {
    let args = program.args.slice(0, -1);
    ssiTask = new ssi(source, target, files, !!program.loosened);
    
    if( program.clean ) {
      let cleanDir = target;
      typeof(program.clean) === 'string' && (cleanDir += program.clean);

      rimraf(cleanDir, () => {
        log(`Deleted ${del(cleanDir)}`);
        compile(...args);
      });
    } else {
      compile(...args);
    }

    if( program.watch ) {
      log(`Watching ${file(source + program.watch)}`);
      chokidar.watch(source + program.watch)
        .on('change', path => {
          log(`${file(path)} was changed`);
          compile(...args, false);
        })
        .on('unlink', path => {
          log(`${del(path)} was deleted`);
          compile(...args, false);
        });
    }
  })
  .parse(process.argv);