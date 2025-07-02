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
      textHandler.updateDisplay(); 
      textHandler.show(); 
    });

    this.el.addEventListener("targetLost", () => {
      window.arOverlayActive = false;
      textHandler.hide(); 
    });
  },
});

document.addEventListener("DOMContentLoaded", () => {
  const modelConfigs = {
    "target-0": {
      modelUrl: "./models/con_tho2.glb",
      imageUrl: "./markers_img/RE(3).webp",
      modelRotation: "0 0 0",
      scale: "0.25 0.25 0.25",
      modelPosition: "0.12 0 0.25",//x y z
      displayText: "Hello! I am Bunny.",
    },
    "target-1": {
      modelUrl: "./models/con_ham_to.glb",
      imageUrl: "./markers_img/RE(4).webp",
      scale: "0.17 0.17 0.17",
      modelRotation: "0 0 0",
      modelPosition: "-0.20 0 0.25",//x y z
      displayText: "I am a Hamster.",
    },
    "target-2": {
      modelUrl: "./models/con_ca.glb",
      imageUrl: "./markers_img/RE(5).webp",
      scale: "0.2 0.2 0.2",
      modelRotation: "20 90 90",
      modelPosition: "-0.20 0 0.25",//x y z
      displayText: "I am Goldie.",
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
