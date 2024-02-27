import { renderTemplate } from "./render.js";

export const createRouter = (config) => {
  const router = async () => {
    const currentView = config.routes[location.pathname];

    if (currentView) {
      document.title = currentView.name;
      await renderTemplate(currentView.src, "main");
    } else {
      history.replaceState("", "", "/");
      router();
    }
  };

  window.addEventListener("click", (e) => {
    if (e.target.matches("a")) {
      e.preventDefault();
      history.pushState("", "", e.target.href);
      router();
    }
  });

  // Update router
  window.addEventListener("popstate", router);
  window.addEventListener("DOMContentLoaded", router);
};
