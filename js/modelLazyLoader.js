AFRAME.registerComponent("lazy-loader", {
  schema: {
    modelUrl: { type: "string" },
    modelPosition: { type: "string", default: "0 0 0" },
    modelRotation: { type: "string", default: "0 0 0" },
    scale: { type: "string", default: "1 1 1" },

    imageUrl: { type: "string" },
    imagePosition: { type: "string", default: "0 0 0" },
    imageheight: { type: "string", default: "0.5" },
    imageWidth: { type: "string", default: "1" },
    imageRotation: { type: "string", default: "0 0 0" },

    displayText: { type: "string", default: "" },
  },
  init: function () {
    const display = document.getElementById("textOverlay");
    const textHandler = new TextOverlayHandler(this.data.displayText, display);
    const audioHandler = new AudioSequenceHandler(
      this.data.audioFiles,
      this.data.audioDelay
    );

    this.el.addEventListener("targetFound", () => {
      window.arOverlayActive = true;
      if (!this.modelLoaded) {
        // Load 3D model
        const model = document.createElement("a-gltf-model");
        model.setAttribute("src", this.data.modelUrl);
        model.setAttribute("position", this.data.modelPosition);
        model.setAttribute("rotation", this.data.modelRotation);
        model.setAttribute("scale", this.data.scale);
        model.setAttribute("animation-mixer", "clip: *;");
        this.el.appendChild(model);

        // // Load image
        // const image = document.createElement("a-plane");
        // image.setAttribute("src", this.data.imageUrl);
        // image.setAttribute("position", this.data.imagePosition);
        // image.setAttribute("height", this.data.imageheight);
        // image.setAttribute("width", this.data.imageWidth);
        // image.setAttribute("rotation", this.data.imageRotation);
        // this.el.appendChild(image);

        this.modelLoaded = true;
      }
      textHandler.updateDisplay();
      textHandler.show();
      audioHandler.playSequence();
    });

    this.el.addEventListener("targetLost", () => {
      window.arOverlayActive = false;
      textHandler.hide();
      audioHandler.stop();
    });
  },
});

document.addEventListener("DOMContentLoaded", () => {
  const modelConfigs = {
    "target-0": {
      modelUrl: "./models/MAX.glb",
      audioFiles: ["./voice/1concho.mp3", "./voice/2concho.mp3"],
      audioDelay: 800, // ms between files
      // imageUrl: "./markers_img/RE(3).webp",
      modelRotation: "0 0 0",
      scale: "0.2 0.2 0.2",
      modelPosition: "0 0 0.25", //x y z
      displayText: "Max: Today is my birthday! Let’s invite Luna!",
    },
    "target-1": {
      modelUrl: "./models/LUNA.glb",
      audioFiles: ["./voice/3concho.mp3", "./voice/4meo.mp3"],
      audioDelay: 800, // ms between files
      // imageUrl: "./markers_img/RE(4).webp",
      scale: "0.17 0.17 0.17",
      modelRotation: "0 0 0",
      modelPosition: "0 0 0.25", //x| y_ z.
      displayText:
        "Max: Luna! Come join my party! \nLuna: Meow. I’ll bring milk!",
    },
    "target-2": {
      modelUrl: "./models/LOUIS.glb",
      audioFiles: ["./voice/5meo.mp3", "./voice/6tho.mp3"],
      audioDelay: 800, // ms between files
      // imageUrl: "./markers_img/RE(5).webp",
      scale: "0.2 0.2 0.2",
      modelRotation: "0 0 0",
      modelPosition: "0 0 0.25", //x y z
      displayText:
        "Luna: It’s Max’s birthday today, Louis!\nLouis:My carrots are good to go!",
    },
    "target-3": {
      modelUrl: "./models/ANNE.glb",
      audioFiles: ["./voice/7tho.mp3", "./voice/8hamto.mp3"],
      audioDelay: 800, // ms between files
      // imageUrl: "./markers_img/RE(5).webp",
      scale: "0.2 0.2 0.2",
      modelRotation: "0 0 0",
      modelPosition: "0 0 0.25", //x y z
      displayText:
        "Louis: Are you coming to Max’s party, Anne?\nAnne: Of course I am! Are sunflower seeds good enough?",
    },
    "target-4": {
      modelUrl: "./models/TONY.glb",
      audioFiles: ["./voice/9hamto.mp3", "./voice/10ca.mp3"],
      audioDelay: 800, // ms between files
      // imageUrl: "./markers_img/RE(5).webp",
      scale: "0.2 0.2 0.2",
      modelRotation: "0 0 0",
      modelPosition: "0 0 0.25", //x y z
      displayText:
        "Anny: Tony! Let’s come to Max’s place together!\nTony: I’ll get my algae then.",
    },
  };

  Object.entries(modelConfigs).forEach(([targetId, config]) => {
    const target = document.querySelector(`#${targetId}`);
    if (target) {
      target.setAttribute("lazy-loader", config);
    }
  });
});

function isInAppBrowser() {
  const ua = navigator.userAgent || navigator.vendor || window.opera;
  // Add more checks for other in-app browsers as needed
  return /zalo|fbav|instagram|line|micromessenger/i.test(ua);
}

if (isInAppBrowser()) {
  alert("Rất tiếc, trải nghiệm AR hiện chỉ hoạt động tốt nhất trên trình duyệt Chrome hoặc Safari. Mong bạn thông cảm!");
}

// function listAvailableVoices() {
//   speechSynthesis.addEventListener('voiceschanged', () => {
//     const voices = speechSynthesis.getVoices();
//     console.table(voices.map(voice => ({
//       name: voice.name,
//       lang: voice.lang,
//       default: voice.default,
//       localService: voice.localService
//     })));
//   });
//   speechSynthesis.getVoices();
// }
// listAvailableVoices();
