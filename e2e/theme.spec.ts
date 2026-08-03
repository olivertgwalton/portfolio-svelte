import { expect, test } from "@playwright/test";

test("switching mode toggles the dark class and persists via cookie", async ({
	page,
}) => {
	await page.goto("/");
	const html = page.locator("html");

	await page.getByRole("button", { name: "Appearance" }).click();
	await page.getByRole("menuitem", { name: "Dark" }).click();
	await expect(html).toHaveClass(/dark/);

	const cookies = await page.context().cookies();
	expect(cookies.find((c) => c.name === "mode")?.value).toBe("dark");

	await page.reload();
	await expect(html).toHaveClass(/dark/);

	await page.getByRole("button", { name: "Appearance" }).click();
	await page.getByRole("menuitem", { name: "Light" }).click();
	await expect(html).not.toHaveClass(/dark/);
});

test("switching theme updates the data-theme attribute", async ({ page }) => {
	await page.goto("/");
	const html = page.locator("html");

	await page.getByRole("button", { name: "Appearance" }).click();
	await page.getByRole("menuitem", { name: "Rose" }).click();
	await expect(html).toHaveAttribute("data-theme", "rose");

	const cookies = await page.context().cookies();
	expect(cookies.find((c) => c.name === "theme")?.value).toBe("rose");
});

// The 404 page used to be a hand-written static/404.html with hardcoded
// colours, so it ignored the visitor's theme entirely. It's a real prerendered
// route now and must pick the theme up like every other page.
test("404 page respects the selected theme", async ({
	page,
	context,
	baseURL,
}) => {
	await context.addCookies([
		{ name: "theme", value: "rose", url: baseURL },
		{ name: "mode", value: "dark", url: baseURL },
	]);

	await page.goto("/404");
	const html = page.locator("html");

	await expect(html).toHaveAttribute("data-theme", "rose");
	await expect(html).toHaveClass(/dark/);
	await expect(page.getByRole("heading", { name: "404" })).toBeVisible();
});
