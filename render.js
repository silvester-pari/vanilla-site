let renderStack = {};

const fetchTemplate = async (src) => {
  return new Promise(async (resolve, reject) => {
    const response = await fetch(src);
    const html = await response.text();
    resolve(html);
  });
};

const injectState = (html) => {
  let renderHtml = html;
  let usedStateProperties;
  const templateExpressions = html.match(/(?<={).*?(?=})/gm);
  if (templateExpressions) {
    usedStateProperties = templateExpressions.filter(
      (e) => globalThis.state[e] !== undefined
    );
    usedStateProperties.forEach((property) => {
      renderHtml = renderHtml.replaceAll(
        `{${property}}`,
        globalThis.state[property]
      );
    });
  }
  return { renderHtml, usedStateProperties };
};

const buildDom = (html, src) => {
  const parser = new DOMParser();
  const template = parser
    .parseFromString(html, "text/html")
    ?.querySelector("template");
  if (!template) {
    reject(`No template defined in ${src}`);
    return;
  }
  const clone = template.content.cloneNode(true);
  //
  const script = parser
    .parseFromString(html, "text/html")
    ?.querySelector("script")?.innerHTML;
  eval(script);
  //
  return clone;
};

const insertElement = (newDomElement, containerElement) => {
  const existing = document.querySelector(containerElement)?.childNodes;
  if (existing.length) {
    document.querySelector(containerElement).innerHTML = "";
  }
  document.querySelector(containerElement).appendChild(newDomElement);
};

export const renderTemplate = async (src, containerElement = "main") => {
  const templateHtml = await fetchTemplate(src, containerElement);
  const { renderHtml, usedStateProperties } = injectState(templateHtml);
  const newDomElement = buildDom(renderHtml, src);
  insertElement(newDomElement, containerElement);

  if (usedStateProperties) {
    usedStateProperties.forEach((p) => {
      if (!renderStack[p]) {
        renderStack[p] = {};
      }
      if (renderStack[p][src]?.container === "main") {
        delete renderStack[p][src];
      }
      renderStack[p][src] = {
        container: containerElement,
        render: () => renderTemplate(src, containerElement),
      };
    });
  }
};

globalThis.addEventListener("message", (evt) => {
  if (evt.data?.type === "refresh") {
    Object.keys(renderStack[evt.data.property]).forEach((src) => {
      renderStack[evt.data.property][src].render();
    });
  }
});
