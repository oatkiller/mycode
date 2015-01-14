var esprima = require("esprima");
var escodegen = require("escodegen");
var fs = require("fs");
var path = require("path");

var mycode = {
  output : function (source) {
    var ast = esprima.parse(source);

    var options = this.options();
    // dunno why?
    options.sourceContent = source;

    return escodegen.generate(ast,this.options());
  },

  options : function () {
    var dirPath = "./";
    var name = ".mycoderc";
    var fullPath;

    // walk up the tree looking for rc files
    while (fs.existsSync(dirPath)) {
      fullPath = path.join(dirPath,name);
      if (fs.existsSync(fullPath)) {
        return require(fullPath);
      } else {
        dirPath += "../";
      }
    }

    // look for the rc in the homedir
    var homerc = path.join("~/",name);
    if (fs.existsSync(homerc)) {
      return require(homerc);
    }

    // defaults
    return this.defaultOptions;
  },

  defaultOptions : {
    format: {
      indent: {
        style: '  ',
        base: 0,
        adjustMultilineComment: false
      },
      newline: '\n',
      space: ' ',
      json: false,
      renumber: false,
      hexadecimal: false,
      quotes: 'double',
      escapeless: false,
      compact: false,
      parentheses: true,
      semicolons: true,
      safeConcatenation: false
    },
    moz: {
      starlessGenerator: false,
      parenthesizedComprehensionBlock: false,
      comprehensionExpressionStartsWithAssignment: false
    },
    parse: null,
    comment: true,
    sourceMap: undefined,
    sourceMapRoot: null,
    sourceMapWithCode: false,
    file: undefined,
    directive: false,
    verbatim: undefined
  }
};

module.exports = mycode;

if (require.main === module) {
  (function () {
    var filePath = process.argv[2];
    var source = fs.readFileSync(filePath,"utf8");
    process.stdout.write(mycode.output(source));
  })();
}
