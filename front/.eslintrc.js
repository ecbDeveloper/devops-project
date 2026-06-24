module.exports = {
  overrides: [
    {
      files: ["*.vue"],
      processor: "vue/block"
    },
    {
      files: ["*.vue/*.css"],
      rules: {
        "@stylistic/no-extra-semicolons": "off"
      }
    }
  ]
};
