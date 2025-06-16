class SpeechHandler {
  constructor(text, displayElement, voiceConfig = {}) {
    this.words = text.split(" ");
    this.display = displayElement;
    this.currentIndex = 0;
    this.voiceConfig = {
      lang: voiceConfig.lang || "en-US",
      name: voiceConfig.name || "",
      pitch: voiceConfig.pitch || 1,
      rate: voiceConfig.rate || 0.7,
    };
    this.utterance = null;
    this.wordStartTimes = [];
    this.currentWordIndex = 0;
  }

  setupSpeech() {
    this.utterance = new SpeechSynthesisUtterance(this.words.join(" "));
    const voices = speechSynthesis.getVoices();

    const selectedVoice =
      voices.find(
        (voice) =>
          voice.name === this.voiceConfig.name &&
          voice.lang.includes(this.voiceConfig.lang)
      ) ||
      voices.find((voice) => voice.lang.includes(this.voiceConfig.lang)) ||
      voices[0];

    if (selectedVoice) {
      this.utterance.voice = selectedVoice;
      this.utterance.lang = this.voiceConfig.lang;
      this.utterance.rate = this.voiceConfig.rate;
      this.utterance.pitch = this.voiceConfig.pitch;
    }

    this.utterance.onboundary = (event) => {
      if (event.name === "word") {
        let wordIndex = 0;
        let charCount = 0;

        for (let i = 0; i < this.words.length; i++) {
          charCount += this.words[i].length + 1;
          if (event.charIndex < charCount) {
            wordIndex = i;
            break;
          }
        }

        this.currentWordIndex = wordIndex;
        this.updateDisplay();
      }
    };

    this.utterance.onstart = () => {
      this.currentWordIndex = 0;
      this.updateDisplay();
    };

    this.utterance.onend = () => {
      this.currentWordIndex = this.words.length - 1;
      this.updateDisplay();
      setTimeout(() => {
        this.display.style.display = "none";
      }, 1000);
    };
  }

  updateDisplay() {
    if (!this.display) return;

    const beforeWords = this.words.slice(0, this.currentWordIndex).join(" ");
    const currentWord = this.words[this.currentWordIndex];
    const afterWords = this.words.slice(this.currentWordIndex + 1).join(" ");

    this.display.innerHTML = `
      <span style="color: #666;">${beforeWords}</span>
      <span style="color: #fff; font-weight: bold; text-decoration: underline;">${
        currentWord || ""
      }</span>
      <span style="color: #666;">${afterWords}</span>
    `;
  }
  //
  start() {
    if (this.display) {
      this.display.style.display = "block";
      this.updateDisplay();
    }
    if (!this.utterance) {
      this.setupSpeech();
    }
    if (this.utterance) {
      speechSynthesis.cancel();
      speechSynthesis.speak(this.utterance);
    }
  }

  stop() {
    if (this.display) {
      this.display.style.display = "none";
      this.currentIndex = 0;
    }
    speechSynthesis.cancel();
  }
}
