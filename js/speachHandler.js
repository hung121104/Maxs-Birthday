class SpeechHandler {
        constructor(text, displayElement) {
          this.words = text.split(" ");
          this.display = displayElement;
          this.currentIndex = 0;
          this.setupSpeech();
        }

        setupSpeech() {
          this.utterance = new SpeechSynthesisUtterance(this.words.join(" "));
          this.utterance.rate = 0.7;
          this.utterance.pitch = 1;

          this.utterance.onboundary = (event) => {
            if (event.name === "word") {
              this.highlightWord();
            }
          };

          this.utterance.onend = () => this.resetDisplay();
        }

        highlightWord() {
          const highlightedText = this.words
            .map(
              (word, index) =>
                `<span style="color: ${
                  index === this.currentIndex ? "yellow" : "white"
                }">${word}</span>`
            )
            .join(" ");

          this.display.innerHTML = highlightedText;
          this.currentIndex++;
        }

        resetDisplay() {
          this.currentIndex = 0;
          this.display.innerHTML = this.words.join(" ");
        }

        start() {
          this.display.style.display = "block";
          this.currentIndex = 0;
          this.highlightWord();
          speechSynthesis.speak(this.utterance);
        }

        stop() {
          this.display.style.display = "none";
          speechSynthesis.cancel();
        }
      }

      window.addEventListener("load", function () {
        const display = document.getElementById("textOverlay");
        const speech = new SpeechHandler(
          "Hello! I am your AR robot guide. I'm here to teach your how to speak english",
          display
        );
        const targetEl = document.querySelector("[mindar-image-target]");

        targetEl.addEventListener("targetFound", () => speech.start());
        targetEl.addEventListener("targetLost", () => speech.stop());
      });