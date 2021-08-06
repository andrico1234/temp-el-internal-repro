const checkboxTemplate = document.createElement("template");

// required	bool	false	Indicates that the checkbox is invalid unless checked.
// readonly	bool	readonly	Indicates that the checkbox is not interactive but its value should still be submitted with the form.
checkboxTemplate.innerHTML = `    
    <label id="label" part="label">
        <slot name="label"></slot>
    </label>
`;

export class Checkbox extends HTMLElement {
  // _internals;

  static get formAssociated() {
    return true;
  }

  static get observedAttributes() {
    return ['checked']
  }

  get disabled() {
    return this.hasAttribute("disabled");
  }

  set disabled(val) {
    if (val) {
      this.setAttribute("disabled", "");
    } else {
      this.removeAttribute("disabled");
    }
  }

  get checked() {
    if (this.getAttribute("checked") === "false") return false;

    return this.hasAttribute("checked");
  }

  set checked(val) {
    const isChecked = Boolean(val);

    if (isChecked) {
      this.setAttribute("checked", "");
    } else {
      this.removeAttribute("checked");
    }
  }

  get form() {
    return this._internals.form;
  }

  constructor() {
    super();

    this.attachShadow({ mode: "open" });
    this._internals = this.attachInternals();
    this.shadowRoot?.appendChild(checkboxTemplate.content.cloneNode(true));
    this.addEventListener("mouseup", this._click);
    this.addEventListener("keydown", this._keyDown);
  }

  connectedCallback() {
    this.setAttribute("role", "checkbox");
    this.setAttribute("aria-checked", "false");

    if (!this.hasAttribute("value")) {
      this.setAttribute("value", "on");
    }

    this._updateValidation();
  }

  attributeChangedCallback(name, _oldVal, newVal) {
    const hasVal = newVal !== null;

    switch (name) {
      case "checked":
        this.indeterminate = false;
        this.setAttribute("aria-checked", `${hasVal}`);
        this._internals.setFormValue(this.checked ? this.value : null);
        this._updateValidation();
        break;
    }
  }

  _keyDown(e) {
    if (e.code === "Enter") {
      this._click();
    }
  }

  _click() {
    const isDisabled = this.disabled;

    if (isDisabled) {
      return;
    }

    this.checked = !this.checked;
  }

  _updateValidation() {
    const isChecked = this.hasAttribute("checked");
    const isDisabled = this.matches(":disabled");
    const isRequired = this.hasAttribute("required");

    if (!isDisabled && isRequired && !isChecked) {
      this.setAttribute("aria-invalid", "true");
      this._internals.setValidity(
        {
          customError: true
        },
        "Please check this box if you want to proceed"
      );
    } else {
      this.setAttribute("aria-invalid", "false");
      this._internals.setValidity({});
    }
  }
}

customElements.define('oui-checkbox', Checkbox);