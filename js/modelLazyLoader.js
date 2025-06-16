AFRAME.registerComponent("lazy-loader", {
  schema: {
    modelUrl: { type: "string" },
    modelPosition: { type: "string", default: "0 0 0" },
    modelRotation: { type: "string", default: "90 0 0" },
    scale: { type: "string", default: "1 1 1" },

    imageUrl: { type: "string" },
    imagePosition: { type: "string", default: "0 0 0" },
    imageheight: { type: "string", default: "1" },
    imageWidth: { type: "string", default: "1" },
    imageRotation: { type: "string", default: "0 0 0" },

    speechText: { type: "string", default: "" },
    voiceLang: { type: "string", default: "en-US" },
    voiceName: { type: "string", default: "" },
    voicePitch: { type: "number", default: 1 },
    voiceRate: { type: "number", default: 0.7 },
  },
  init: function () {
    // Create speech handler instance
    const display = document.getElementById("textOverlay");
    this.speechHandler = new SpeechHandler(this.data.speechText, display, {
      lang: this.data.voiceLang,
      name: this.data.voiceName,
      pitch: this.data.voicePitch,
      rate: this.data.voiceRate,
    });

    this.el.addEventListener("targetFound", () => {
      if (!this.modelLoaded) {
        // Load 3D model
        const model = document.createElement("a-gltf-model");
        model.setAttribute("src", this.data.modelUrl);
        model.setAttribute("position", this.data.modelPosition);
        model.setAttribute("rotation", this.data.modelRotation);
        model.setAttribute("scale", this.data.scale);
        model.setAttribute("animation-mixer", "clip: *;");
        this.el.appendChild(model);

        // Load image
        const image = document.createElement("a-plane");
        image.setAttribute("src", this.data.imageUrl);
        image.setAttribute("position", this.data.imagePosition);
        image.setAttribute("height", this.data.imageheight);
        image.setAttribute("width", this.data.imageWidth);
        image.setAttribute("rotation", this.data.imageRotation);
        this.el.appendChild(image);

        this.modelLoaded = true;
      }
      this.speechHandler.start();
    });

    this.el.addEventListener("targetLost", () => {
      this.speechHandler.stop();
    });
  },
});

document.addEventListener("DOMContentLoaded", () => {
  const modelConfigs = {
    "target-0": {
      modelUrl: "./models/robot.glb",
      imageUrl: "./markers_img/zani-is-so-me-v0-miukmd3nny0f1.webp",
      scale: "0.25 0.25 0.25",
      speechText: "Hello! I am your AR robot guide.",
      voiceLang: "en-US",
      voiceName: "Microsoft David",
      voicePitch: 1.2,
      voiceRate: 0.8,
    },
    "target-1": {
      modelUrl: "./models/fish.glb",
      imageUrl: "./markers_img/119373955_p0.png",
      speechText: "This is a beautiful fish swimming in the ocean.",
      voiceLang: "ja-JP",
      voiceName: "Microsoft Hazel",
      voicePitch: 1.1,
      voiceRate: 0.7,
    },
    "target-2": {
      modelUrl: "./models/shibahu.glb",
      imageUrl: "./markers_img/GAnH76vasAEuHEO.jpg",
      speechText: "Meet my friend Shiba!",
      voiceLang: "en-US",
      voiceName: "Microsoft David",
      voicePitch: 0.9,
      voiceRate: 0.75,
    },
  };

  Object.entries(modelConfigs).forEach(([targetId, config]) => {
    const target = document.querySelector(`#${targetId}`);
    if (target) {
      target.setAttribute("lazy-loader", config);
    }
  });
});

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
//
