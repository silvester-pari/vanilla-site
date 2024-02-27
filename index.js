import { createState } from "./state.js";
import { createRouter } from "./router.js";
import { renderTemplate } from "./render.js";

export const createApp = (config) => {
  createState(config.state);
  createRouter(config.router);
  for (const element of ["header", "footer"]) {
    const domElement = document.querySelector(element);
    const src = domElement.getAttribute("src") || `./components/${element}.html`;
    renderTemplate(src, element);
  }
};
