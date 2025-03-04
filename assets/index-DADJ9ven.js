(function polyfill() {
  const relList = document.createElement("link").relList;
  if (relList && relList.supports && relList.supports("modulepreload")) {
    return;
  }
  for (const link of document.querySelectorAll('link[rel="modulepreload"]')) {
    processPreload(link);
  }
  new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      if (mutation.type !== "childList") {
        continue;
      }
      for (const node of mutation.addedNodes) {
        if (node.tagName === "LINK" && node.rel === "modulepreload")
          processPreload(node);
      }
    }
  }).observe(document, { childList: true, subtree: true });
  function getFetchOpts(link) {
    const fetchOpts = {};
    if (link.integrity) fetchOpts.integrity = link.integrity;
    if (link.referrerPolicy) fetchOpts.referrerPolicy = link.referrerPolicy;
    if (link.crossOrigin === "use-credentials")
      fetchOpts.credentials = "include";
    else if (link.crossOrigin === "anonymous") fetchOpts.credentials = "omit";
    else fetchOpts.credentials = "same-origin";
    return fetchOpts;
  }
  function processPreload(link) {
    if (link.ep)
      return;
    link.ep = true;
    const fetchOpts = getFetchOpts(link);
    fetch(link.href, fetchOpts);
  }
})();
const AppFooter = () => {
  const container = document.createDocumentFragment();
  const footer = document.createElement("footer");
  footer.classList.add("footer");
  container.appendChild(footer);
  const render = () => {
    footer.innerHTML = /* html */
    `
    <p>&copy; 우아한테크코스 All Rights Reserved.</p>
    <p><img src="./images/woowacourse_logo.png" width="180" /></p>
    `;
  };
  render();
  return container;
};
const getFavoriteMovies = async (index = 1) => {
  const url = `https://api.themoviedb.org/3/movie/popular?language=ko-KR&page=${index}`;
  const response = await fetch(url, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${"eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJkNDhkMDg4NzU4MmI4NjY2NDMwMTQwZjRkODk3NTc3MiIsIm5iZiI6MTU0MzIzODEwMC42NTY5OTk4LCJzdWIiOiI1YmZiZjFkNDkyNTE0MTEzMjkwMGRmOGYiLCJzY29wZXMiOlsiYXBpX3JlYWQiXSwidmVyc2lvbiI6MX0.7RInpLgb8h4m-d_7UfWp89EaaZIw4CUBxQLq4vKUjGs"}`
    }
  });
  const data = await response.json();
  return data;
};
const getTopRatedMovies = async () => {
  const url = `https://api.themoviedb.org/3/movie/top_rated?language=ko-KR&page=1`;
  const response = await fetch(url, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${"eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJkNDhkMDg4NzU4MmI4NjY2NDMwMTQwZjRkODk3NTc3MiIsIm5iZiI6MTU0MzIzODEwMC42NTY5OTk4LCJzdWIiOiI1YmZiZjFkNDkyNTE0MTEzMjkwMGRmOGYiLCJzY29wZXMiOlsiYXBpX3JlYWQiXSwidmVyc2lvbiI6MX0.7RInpLgb8h4m-d_7UfWp89EaaZIw4CUBxQLq4vKUjGs"}`
    }
  });
  const data = await response.json();
  return data;
};
const handler = {
  listeners: [],
  set(target, key, value) {
    if (key in target) {
      target[key] = value;
      handler.notify(key, value);
      return true;
    }
    return false;
  },
  subscribe(listener) {
    handler.listeners.push(listener);
  },
  unsubscribe(listener) {
    handler.listeners = this.listeners.filter((l) => l !== listener);
  },
  notify(key, value) {
    handler.listeners.forEach((listener) => listener(key, value));
  }
};
const state = (initialState) => {
  const innerState = new Proxy(
    {
      value: initialState
    },
    handler
  );
  return { value: innerState, ...handler };
};
const AppHeader = () => {
  const { value: headerState, subscribe } = state([]);
  const getResponse = async () => {
    const response = await getTopRatedMovies();
    return response;
  };
  (async () => {
    const data = await getResponse();
    const { results } = data;
    headerState.value = results;
  })();
  const container = document.createDocumentFragment();
  const header = document.createElement("header");
  container.appendChild(header);
  const render = () => {
    var _a, _b;
    console.log(headerState.value);
    header.innerHTML = /* html */
    `
    <div class="background-container">
    ${(_a = headerState.value) == null ? void 0 : _a.slice(0, 1).map((result) => {
      const { poster_path: posterPath } = result;
      return (
        /* html */
        `<div class="overlay" aria-hidden="true"
          style="background-image:url('https://media.themoviedb.org/t/p/w1920_and_h1080_face${posterPath}')"
        ></div>`
      );
    }).join("")}

      <div class="top-rated-container">
        <h1 class="logo">
          <img src="logo.png" alt="MovieList" />
        </h1>
        <div class="top-rated-movie">
          
        ${(_b = headerState.value) == null ? void 0 : _b.slice(0, 1).map((result) => {
      const { title, vote_average: voteAverage } = result;
      return (
        /* html */
        `<div class="rate">
          <img src="star_empty.png" class="star" />
          <span class="rate-value">${voteAverage}</span>
        </div>
        <div class="title">${title}</div>
        <button class="primary detail">자세히 보기</button>`
      );
    }).join("")}
        </div>
      </div>
    </div>
    `;
  };
  render();
  subscribe(() => {
    render();
  });
  return container;
};
const ThumbnailList = ({ mainState }) => {
  const container = document.createDocumentFragment();
  const div = document.createElement("div");
  container.appendChild(div);
  const render = () => {
    var _a;
    div.innerHTML = /* html */
    `<ul class="thumbnail-list">
        ${(_a = mainState.value) == null ? void 0 : _a.map((result) => {
      const { title, poster_path: posterPath } = result;
      return (
        /* html */
        `<li>
              <div class="item">
                <img
                  class="thumbnail"
                  src="
https://media.themoviedb.org/t/p/w440_and_h660_face${posterPath}"
                  alt="인사이드 아웃 2"
                />
                <div class="item-desc">
                  <p class="rate">
                    <img src="star_empty.png" class="star" />
                    <span>7.7</span>
                  </p>
                  <strong>${title}</strong>
                </div>
              </div>
            </li>`
      );
    }).join("")}
      </ul>`;
  };
  render();
  return container.querySelector("div").innerHTML;
};
const MainTabs = () => {
  const container = document.createDocumentFragment();
  const div = document.createElement("div");
  container.appendChild(div);
  const render = () => {
    div.innerHTML = /* html */
    `<ul class="tab">
      <li>
        <a href="#">
          <div class="tab-item selected"><h3>상영 중</h3></div>
        </a>
      </li>
      <li>
        <a href="#">
          <div class="tab-item"><h3>인기순</h3></div>
        </a>
      </li>
      <li>
        <a href="#">
          <div class="tab-item"><h3>평점순</h3></div>
        </a>
      </li>
      <li>
        <a href="#">
          <div class="tab-item"><h3>상영 예정</h3></div>
        </a>
      </li>
    </ul>`;
  };
  render();
  return container.querySelector("div").innerHTML;
};
const AppMain = () => {
  const { value: mainState, subscribe } = state([]);
  const { value: pageState } = state(1);
  const container = document.createDocumentFragment();
  const div = document.createElement("div");
  div.classList.add("container");
  div.innerHTML = /* html */
  `
    ${MainTabs()}
    <main>
      <h2>지금 인기 있는 영화</h2>  
      <section>
          ${ThumbnailList({
    mainState
  })}
      </section>
    </main>
  `;
  const getResponse = async (index) => {
    const response = await getFavoriteMovies(index);
    return response;
  };
  const handleClick = async () => {
    pageState.value += 1;
    const data = await getResponse(pageState.value);
    const { results } = data;
    mainState.value = [...mainState.value, ...results];
  };
  const button = document.createElement("button");
  button.addEventListener("click", handleClick);
  button.innerHTML = "더 보기";
  div.querySelector("section").insertAdjacentElement("afterend", button);
  container.appendChild(div);
  (async () => {
    const data = await getResponse(pageState.value);
    const { results } = data;
    mainState.value = results;
  })();
  const render = async () => {
    if (pageState.value >= 2 && div.querySelector("button")) {
      div.querySelector("main").removeChild(button);
    }
    div.querySelector("section").innerHTML = /* html */
    `
        ${ThumbnailList({
      mainState
    })}
  `;
  };
  subscribe(() => {
    render();
  });
  return container;
};
window.addEventListener("load", () => {
  const app = document.querySelector("#app");
  if (app) {
    app.appendChild(AppHeader());
    app.appendChild(AppMain());
    app.appendChild(AppFooter());
  }
});
