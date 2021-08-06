const { playwrightLauncher } = require("@web/test-runner-playwright");

module.exports = {
  nodeResolve: true,
  browsers: [
    playwrightLauncher({ product: "firefox" }),
    playwrightLauncher({ product: "chromium" }),
    playwrightLauncher({ product: "webkit" }),
  ],
  testFramework: {
    config: {
      timeout: "3000",
    },
  },
  files: "src/*.test.js",
};
