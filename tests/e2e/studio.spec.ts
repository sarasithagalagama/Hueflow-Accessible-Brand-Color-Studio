import { expect, test } from "@playwright/test";

test("visitor edits a gradient, copies CSS, and retains the draft", async ({ page }) => {
  await page.goto("/studio");
  await expect(page.getByLabel(/hero preview/)).toBeVisible();
  const name = page.getByLabel("Gradient name");
  await name.fill("Persistent field study");
  await page.getByRole("button", { name: /Export/ }).click();
  await page.getByRole("button", { name: "Copy", exact: true }).click();
  await expect(page.getByRole("button", { name: "Copied" })).toBeVisible();
  await page.getByRole("button", { name: "Close export" }).click();
  await page.reload();
  await expect(name).toHaveValue("Persistent field study");
});

test("visitor opens a preset in Studio", async ({ page }) => {
  await page.goto("/explore");
  await page.getByLabel("Open Sunset Glow in Studio").click();
  await expect(page).toHaveURL(/\/studio/);
  await expect(page.getByLabel("Gradient name")).toHaveValue("Sunset Glow");
});

test("accessibility workspace reports sampled contrast", async ({ page }) => {
  await page.goto("/accessibility");
  await expect(page.getByText("LOWEST OF 17 SAMPLES")).toBeVisible();
  await expect(page.getByText(/Endpoint checks are not enough/)).toBeVisible();
});

test("save shortcut opens the project workflow", async ({ page }) => {
  await page.goto("/studio");
  await page.keyboard.press(process.platform === "darwin" ? "Meta+s" : "Control+s");
  await expect(page.getByRole("heading", { name: /Add .* to a project/ })).toBeVisible();
  await expect(page.getByRole("button", { name: "Sign in to continue" })).toBeVisible();
});
