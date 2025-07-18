class TextOverlayHandler {
  constructor(text, displayElement) {
    this.text = text;
    this.display = displayElement;
  }

  updateDisplay() {
    if (this.display) {
      // Replace \n with <br> for HTML display
      const htmlText = this.text.replace(/\n/g, "<br>");
      this.display.innerHTML = `<span style="color: #fff; font-weight: bold;">${htmlText}</span>`;
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

class AudioSequenceHandler {
  constructor(audioFiles, delay = 800) {
    this.audioFiles = audioFiles || [];
    this.delay = delay;
    this.current = 0;
    this.audio = null;
    this.isPlaying = false;
  }

  playSequence() {
    if (!this.audioFiles.length) return;
    this.current = 0;
    this.isPlaying = true;
    this.playNext();
  }

  playNext() {
    if (this.current >= this.audioFiles.length) {
      this.isPlaying = false;
      return;
    }
    this.audio = new Audio(this.audioFiles[this.current]);
    this.audio.play();
    this.audio.onended = () => {
      setTimeout(() => {
        this.current++;
        this.playNext();
      }, this.delay);
    };
  }

  stop() {
    if (this.audio) {
      this.audio.pause();
      this.audio.currentTime = 0;
    }
    this.isPlaying = false;
  }
}
