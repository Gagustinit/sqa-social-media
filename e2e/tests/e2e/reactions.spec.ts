import { test, expect, request as pwRequest } from "@playwright/test";

const BASE_URL = "http://localhost:3000";
const API_BASE = "http://localhost:8080";

test.describe("E2E - HOME - LIKES E DISLIKES", () => {
  test("deve exibir o número de curtidas e descurtidas em cada postagem", async ({
    page,
  }) => {
    await page.goto(BASE_URL);

    const cards = page.getByRole("listitem");
    await expect(cards.first()).toBeVisible();

    const total = await cards.count();
    expect(total).toBeGreaterThan(0);

    for (let i = 0; i < total; i++) {
      const card = cards.nth(i);
      await expect(card.getByTestId("post-likes")).toHaveText(/^👍 \d+$/);
      await expect(card.getByTestId("post-dislikes")).toHaveText(/^👎 \d+$/);
    }
  });

  test("deve exibir na tela os mesmos valores de reactions retornados pela API", async ({
    page,
  }) => {
    const api = await pwRequest.newContext({ baseURL: API_BASE });
    const resp = await api.get("/posts", { params: { limit: 10, skip: 0 } });
    expect(resp.status()).toBe(200);
    const { posts } = await resp.json();

    await page.goto(BASE_URL);
    const cards = page.getByRole("listitem");
    await expect(cards).toHaveCount(posts.length);

    for (let i = 0; i < posts.length; i++) {
      const card = cards.nth(i);
      await expect(card.getByTestId("post-likes")).toHaveText(
        `👍 ${posts[i].reactions.likes}`
      );
      await expect(card.getByTestId("post-dislikes")).toHaveText(
        `👎 ${posts[i].reactions.dislikes}`
      );
    }
  });
});
