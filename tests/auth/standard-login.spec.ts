// spec: specs/saucedemo-login.md (scenario 1.1)
import { test, expect } from "../../src/fixtures/base";
import { meta } from "reporting-labs";
import users from "../data/users.json";

test.describe("Login", () => {
  test("standard-user-successful-login @smoke @critical", async ({
    page,
    loginPage,
    inventoryPage,
  }) => {
    meta({
      priority: "P0",
      severity: "critical",
      feature: "authentication",
      component: "login",
    });
    const { username, password } = users.standard;

    await loginPage.goto();

    // 1. Type 'standard_user' into the Username field
    await loginPage.usernameInput.fill(username);
    await expect(loginPage.usernameInput).toHaveValue(username);

    // 2. Type 'secret_sauce' into the Password field
    await loginPage.passwordInput.fill(password);
    await expect(loginPage.passwordInput).toHaveValue(password);
    await expect(loginPage.passwordInput).toHaveAttribute("type", "password");

    // 3. Click the Login button
    await loginPage.loginButton.click();
    await expect(page).toHaveURL("https://www.saucedemo.com/inventory.html");
    await expect(inventoryPage.title).toHaveText("Products");
    await expect(inventoryPage.items).toHaveCount(6);
    await expect(inventoryPage.cartButton).toBeVisible();
    await expect(inventoryPage.cartBadge).toHaveCount(0);
    await expect(loginPage.errorMessage).toHaveCount(0);
    await expect(loginPage.loginButton).toBeHidden();
  });
});
