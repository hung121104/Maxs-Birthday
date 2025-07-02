class TextOverlayHandler {
  constructor(text, displayElement) {
    this.text = text;
    this.display = displayElement;
  }

  updateDisplay() {
    if (this.display) {
      this.display.innerHTML = `<span style="color: #fff; font-weight: bold;">${this.text}</span>`;
    }
  }

  show() {
    if (this.display) {
      this.display.style.display = "block";
      this.display.style.setProperty("display", "block", "important");
    }
  }

  hide() {
    if (this.display) {
      this.display.style.display = "none";
    }
  }
}
