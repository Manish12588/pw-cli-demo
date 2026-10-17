import { Locator, Page } from "@playwright/test";
import { BasePage } from "./BasePage";

export class InventoryPage extends BasePage {
  readonly title: Locator;
  readonly items: Locator;
  readonly cartButton: Locator;
  readonly cartBadge: Locator;

  constructor(page: Page) {
    super(page);
    this.title = page.getByTestId("title");
    this.items = page.getByTestId("inventory-item");
    this.cartButton = page.getByRole("button", { name: "Cart, empty" });
    this.cartBadge = page.getByTestId("shopping-cart-badge");
  }

  async goto(): Promise<void> {
    await this.page.goto("/inventory.html");
  }
}
