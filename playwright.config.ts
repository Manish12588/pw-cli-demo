import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "./tests",
  reporter: [
    ["list"],
    ["reporting-labs", { title: "SauceDemo Login Tests", open: "never" }],
    ["allure-playwright", { resultsDir: "allure-results" }],
  ],
  use: {
    baseURL: "https://www.saucedemo.com",
    testIdAttribute: "data-test",
  },
});
