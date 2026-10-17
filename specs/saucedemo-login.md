# SauceDemo Login Test Plan

## Application Overview

Swag Labs (https://www.saucedemo.com) is a demo e-commerce site. Its entry point is a single login form with a Username textbox, a Password textbox and a Login button. A successful login redirects to `/inventory.html` (the "Products" page). A failed login stays on `/` and shows a dismissible error banner (`alert`) starting with "Epic sadface:". The login page lists the accepted usernames and states that the password for all users is `secret_sauce`.

Observed during exploration (headed browser, playwright-cli):

| Input                              | Result                                                                      |
| ---------------------------------- | --------------------------------------------------------------------------- |
| empty username, empty password     | `Epic sadface: Username is required`                                        |
| `standard_user`, empty password    | `Epic sadface: Password is required`                                        |
| `foo` / `bar`                      | `Epic sadface: Username and password do not match any user in this service` |
| `locked_out_user` / `secret_sauce` | `Epic sadface: Sorry, this user has been locked out.`                       |
| `standard_user` / `secret_sauce`   | Redirect to `/inventory.html`, "Products" title, 6 inventory items          |

Element notes: the form is named "Login". The inputs are `textbox "Username"` and `textbox "Password"`, and the submit control is `button "Login"`. The error banner is `alert` containing `button "Dismiss error"`. After login, the inventory page shows `button "Open Menu"`, `button "Cart, empty"` and `combobox "Sort products"`.

## Test Scenarios

### 1. Login

**Seed:** `tests/seed.spec.ts` (to be created at generation time; it only navigates to `https://www.saucedemo.com/`)

#### 1.1. standard-user-successful-login

**File:** `tests/login/standard-user-successful-login.spec.ts`

**Preconditions:**

- Browser is on the login page `https://www.saucedemo.com/` in a fresh session (not logged in).
- Valid account `standard_user` / `secret_sauce` exists.

**Steps:**

1. Type `standard_user` into the Username field


    - expect: Username field has value `standard_user`

2. Type `secret_sauce` into the Password field


    - expect: Password field is masked and has a non-empty value

3. Click the Login button


    - expect: URL becomes `https://www.saucedemo.com/inventory.html`
    - expect: Page title area shows the heading text "Products"
    - expect: Inventory list is visible with 6 products
    - expect: Cart button is visible and shows no item badge (accessible name "Cart, empty")
    - expect: No error banner is visible
    - expect: Login form is no longer displayed

#### 1.2. locked-out-user-shows-error

**File:** `tests/login/locked-out-user-shows-error.spec.ts`

**Preconditions:**

- Browser is on the login page in a fresh session.
- Account `locked_out_user` / `secret_sauce` exists and is locked.

**Steps:**

1. Type `locked_out_user` into the Username field
2. Type `secret_sauce` into the Password field
3. Click the Login button


    - expect: Error banner is visible with text "Epic sadface: Sorry, this user has been locked out."
    - expect: URL remains `https://www.saucedemo.com/`
    - expect: Username field still contains `locked_out_user`
    - expect: Login form is still displayed and the inventory page is not shown

#### 1.3. empty-username-shows-error

**File:** `tests/login/empty-username-shows-error.spec.ts`

**Preconditions:**

- Browser is on the login page in a fresh session.
- Both fields are empty.

**Steps:**

1. Leave the Username field empty and type `secret_sauce` into the Password field (optional; the same error is expected when both fields are empty)


    - expect: Username field is empty

2. Click the Login button


    - expect: Error banner is visible with text "Epic sadface: Username is required"
    - expect: URL remains `https://www.saucedemo.com/`
    - expect: Login form is still displayed

> Exploration covered the both-fields-empty variant. The password-filled variant was not run; confirm it during generation.

#### 1.4. empty-password-shows-error

**File:** `tests/login/empty-password-shows-error.spec.ts`

**Preconditions:**

- Browser is on the login page in a fresh session.
- Password field is empty.

**Steps:**

1. Type `standard_user` into the Username field


    - expect: Username field has value `standard_user`

2. Leave the Password field empty and click the Login button


    - expect: Error banner is visible with text "Epic sadface: Password is required"
    - expect: URL remains `https://www.saucedemo.com/`
    - expect: Username field still contains `standard_user`
    - expect: Password field is empty

#### 1.5. invalid-credentials-show-error

**File:** `tests/login/invalid-credentials-show-error.spec.ts`

**Preconditions:**

- Browser is on the login page in a fresh session.
- No account `foo` exists.

**Steps:**

1. Type `foo` into the Username field


    - expect: Username field has value `foo`

2. Type `bar` into the Password field


    - expect: Password field is non-empty

3. Click the Login button


    - expect: Error banner is visible with text "Epic sadface: Username and password do not match any user in this service"
    - expect: URL remains `https://www.saucedemo.com/`
    - expect: Login form is still displayed and the inventory page is not shown

## Notes for Generation

- Scenarios are independent; each starts from a fresh navigation to the login page.
- The `playwright-cli` session produced `[data-test="username"]` and `[data-test="login-button"]` locators. Check `generate-locator` output for the password field and the error banner before writing assertions. The error banner text includes the full "Epic sadface: ..." string, so assert it with `toContainText` or an exact-text match on a test-id/alert locator rather than a text-based locator.
- Refs (`e11`, `f1e11`, ...) change after reload and after the page navigates. Re-snapshot before reusing them.
- No Playwright config or seed test exists in this workspace yet. Create them when moving to generation.
