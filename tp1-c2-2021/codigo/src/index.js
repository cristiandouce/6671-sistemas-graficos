import fs_source from "./shaders/shader.frag";
import vs_source from "./shaders/shader.vert";

import GLEngine from "./helpers/webgl-engine";

const engine = new GLEngine({
  canvas: document.getElementById("application-canvas"),
  shaders: {
    fragment: fs_source,
    vertex: vs_source,
  },
});

console.log(engine);
