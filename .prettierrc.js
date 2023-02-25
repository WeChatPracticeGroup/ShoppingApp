module.exports = {
    trailingCommas: "es5",
    tabWidth: 4,
    semi: true,
    bracketSpacing: true,
    overrides: [
        {
          files: "*.wxml",
          options: { parser: "html" }
        },
        {
          files: "*.wxss",
          options: { "parser": "css" }
        },
        {
          files: "*.wxs",
          options: { "parser": "babel" }
        }
      ],
};
