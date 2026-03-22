import { render } from "vitest-browser-vue";
import DuyiArea from "../src/DuyiArea/DuyiArea.vue";

describe("DuyiArea.vue", () => {
  test("mounted", async () => {
    const screen = render(DuyiArea);
    screen.container.style.zoom = "2";
    const n1 = screen.getByTestId("n1");
    const n2 = screen.getByTestId("n2");
    const result = screen.getByTestId("result");
    expect((n1.element() as HTMLInputElement).value).toBe("1");
    expect((n2.element() as HTMLInputElement).value).toBe("2");
    expect(result.element().textContent).toBe("sum:3");
    await n1.fill("3");
    await n2.fill("4");
    expect(result.element().textContent).toBe("sum:7");
  });
});
