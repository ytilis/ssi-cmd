# ssi-cmd

## Command line tool to call ssi npm package

### Installation
```
npm install ssi-cmd
```

### Usage
```
  Usage: ssi <source> <target> <files> [options]

    Options:

    -w, --watch <pattern>  Watch for changes and recompile if any
    -c, --clean [folder]   Delete the target folder before compiling
    -l, --loosened         Support loosened spacing in ssi directives
    -h, --help             output usage information
```

This package is essentially a command-line interface to [ssi](https://www.npmjs.com/package/ssi), which allows you to use server-side include directives for simple includes and the like.

### Examples
For a directory structured as follows:
```
root
|-- dist
|-- src
|   |-- partials
|   |   |-- part1.html
|   |   |-- part2.html
|   |-- page1.html
|   |-- page2.html
|-- package.json
```

#### Compile any html templates directly under the `/src` to the `/dist` directory
```
ssi src dist '/*.html'
```

#### Compile *all* html templates under `/src` and any subfolders to an equivalent folder under `/dist` (including partials in the above example)
```
ssi src dist '/**/*.html'
```

#### Delete the `/dist` directory before copying the files over
```
ssi src dist '/*.html' -c
```

#### Delete only html files under the `/dist` directory before copying the files over
```
ssi src dist '/*.html' -c '/*.html'
```

#### Watch for changes to templates and partials and recompile when they occur
```
ssi src dist '/*.html' -w '/**/*.html'
```