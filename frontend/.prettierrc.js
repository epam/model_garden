module.exports = {
    singleQuote: true,
    trailingComma: "none",
    endOfLine: "lf",
    printWidth: 120,
    overrides: [
      {
        files: "*.json",
        options: {
          printWidth: 200
        }
      }
    ]
  };