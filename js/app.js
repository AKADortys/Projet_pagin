const app = {
  cachePages: new Map(),
  contentElment: document.getElementById("container"),
  defaultPage: "home",
  editMode: false, // Indique si on est en mode modification
  currentUserId: null, // Stocke l'ID de l'utilisateur à modifier
};

app.init = async function () {
  db.init();
  location.href = `#${app.defaultPage}`;

  app.loadPage(app.defaultPage);
  app.activePage(app.defaultPage);
  window.addEventListener("hashchange", async (e) => {
    const url = new URL(e.newURL);
    const hash = url.hash.replace("#", "");
    if (hash) {
      await app.loadPage(hash);
      await app.activePage(hash);
    }
  });
};
app.loadPage = async function (page) {
  if (app.cachePages.has(page)) {
    const cachedPage = app.cachePages.get(page);
    app.contentElment.innerHTML = cachedPage.html;
    try {
      if (cachedPage.script) {
        executeScript(cachedPage.script, page);
      }
    } catch (error) {
      console.error("Une erreur est survenue lors de l'exec du script:", error);
    }
    return;
  }
  const htmlResponse = await axios.get(`/pages/${page}.html`).catch(() => null);
  const scriptResponse = await axios.get(`/js/${page}.js`).catch(() => null);
  if (!htmlResponse) {
    location.href = "#404";
    return;
  }
  if (htmlResponse.status === 200) {
    const scriptContent = scriptResponse?.data || null;
    app.cachePages.set(page, {
      html: htmlResponse.data,
      script: scriptContent,
    });
    app.contentElment.innerHTML = htmlResponse.data;
    try {
      if (scriptContent) {
        executeScript(scriptContent, page);
      }
    } catch (error) {}
  }
};

function executeScript(scriptContent, page) {
  document
    .querySelectorAll(`[data-script="${page}"]`)
    .forEach((el) => el.remove());

  const scriptElement = document.createElement("script");
  scriptElement.textContent = scriptContent;
  scriptElement.setAttribute("data-script", page);
  document.body.appendChild(scriptElement);

  if (typeof initModule === "function") {
    initModule();
  }
}

app.activePage = async function (page) {
  const list = document.querySelector(".nav");
  list
    .querySelectorAll(".active")
    .forEach((el) => el.classList.remove("active"));
  list.querySelector(`[href='#${page}']`).classList.add("active");
};

(async function () {
  await app.init();
})();
