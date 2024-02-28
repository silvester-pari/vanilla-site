import { renderTemplate } from "./render.js";

export const createRouter = (config) => {
  const router = async () => {
    const currentView =
      config.routes[
        location.pathname.replace(config.base.replace(/\/$/, ""), "")
      ];

    if (currentView) {
      document.title = currentView.name;
      await renderTemplate(currentView.src, "main");
    } else {
      history.replaceState("", "", config.base || "/");
      router();
    }
  };

  window.addEventListener("click", (e) => {
    if (e.target.matches("a")) {
      e.preventDefault();
      history.pushState(
        "",
        "",
        (config.base || "/") + e.target.pathname.replace(/^\//, "")
      );
      router();
    }
  });

  // Update router
  window.addEventListener("popstate", router);
  window.addEventListener("DOMContentLoaded", router);
};
