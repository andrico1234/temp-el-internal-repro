import { html, fixture, expect } from "@open-wc/testing";
import sinon from "sinon";
import "element-internals-polyfill";
import "./Checkbox";

describe("<oui-checkbox>", () => {
  describe("disabled property", () => {
    it("should not checkbox when disabled by default", async () => {
      const el = await fixture(html`
        <oui-checkbox disabled>
          <p slot="label">Checkbox label</p>
        </oui-checkbox>
      `);

      expect(el.getAttribute("checked")).to.be.equal(null);
      expect(el.disabled).to.be.equal(true);

      const event = new Event("mouseup");
      el.dispatchEvent(event);

      expect(el.getAttribute("checked")).to.be.equal(null);
      expect(el.getAttribute("aria-checked")).to.be.equal("false");
    });

    it("should not check box when disabled programmatically", async () => {
      const el = await fixture(html`
        <oui-checkbox>
          <div slot></div>
          <p slot="label">Checkbox label</p>
        </oui-checkbox>
      `);

      expect(el.getAttribute("checked")).to.be.equal(null);
      expect(el.getAttribute("disabled")).to.be.equal(null);
      expect(el.disabled).to.be.equal(false);
      expect(el.getAttribute("aria-checked")).to.be.equal("false");

      const event = new Event("mouseup");
      el.dispatchEvent(event);

      expect(el.getAttribute("checked")).to.be.equal("");

      el.disabled = true;
      el.dispatchEvent(event);

      expect(el.getAttribute("disabled")).to.be.equal("");
      expect(el.getAttribute("checked")).to.be.equal("");
      expect(el.getAttribute("aria-checked")).to.be.equal("true");

      el.disabled = false;
      el.dispatchEvent(event);

      expect(el.getAttribute("disabled")).to.be.equal(null);
      expect(el.disabled).to.be.equal(false);
      expect(el.getAttribute("checked")).to.be.equal(null);
      expect(el.getAttribute("aria-checked")).to.be.equal("false");
    });
  });

  describe("validation", () => {
    it.only("should ignore validation if the checkbox is disabled", async () => {
      const fake = sinon.fake();
      const onSubmitMock = (e) => {
        e.preventDefault();
        fake();
      };

      const el = await fixture(html`
        <form @submit=${onSubmitMock}>
          <oui-checkbox required disabled>
            <p slot="label">Checkbox label</p>
            <button>Click</button>
          </oui-checkbox>
        </form>
      `);

      const checkboxEl = el.querySelector("oui-checkbox");
      const buttonEl = el.querySelector("button");

      buttonEl.click();

      console.log(el);

      expect(checkboxEl.getAttribute("disabled")).to.be.equal("");
      // expect(checkboxEl.getAttribute('aria-invalid')).to.be.equal('false')
      expect(fake.callCount).to.be.equal(1);
    });
  });
});
