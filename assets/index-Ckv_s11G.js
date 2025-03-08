var __defProp = Object.defineProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField = (obj, key, value) => __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
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
const toElement = ({ rootElementName = "div", domString }) => {
  const container = document.createDocumentFragment();
  const rootElement = document.createElement(rootElementName);
  container.appendChild(rootElement);
  const render = () => {
    rootElement.innerHTML = /* html */
    domString;
  };
  render();
  return container;
};
const AppFooter = () => toElement({
  domString: `
    
    <footer class="footer">
    <p>&copy; 우아한테크코스 All Rights Reserved.</p>
    <p><img src="./images/woowacourse_logo.png" width="180" /></p></footer>`
});
const getFavoriteMovies = async (index = 1) => {
  const url = `https://api.themoviedb.org/3/movie/popular?language=ko-KR&page=${index}`;
  const response = await fetch(url, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${"eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJkNDhkMDg4NzU4MmI4NjY2NDMwMTQwZjRkODk3NTc3MiIsIm5iZiI6MTU0MzIzODEwMC42NTY5OTk4LCJzdWIiOiI1YmZiZjFkNDkyNTE0MTEzMjkwMGRmOGYiLCJzY29wZXMiOlsiYXBpX3JlYWQiXSwidmVyc2lvbiI6MX0.7RInpLgb8h4m-d_7UfWp89EaaZIw4CUBxQLq4vKUjGs"}`
    }
  });
  const { results } = await response.json();
  return results;
};
const getTopRatedMovies = async () => {
  const url = `https://api.themoviedb.org/3/movie/top_rated?language=ko-KR&page=1`;
  const response = await fetch(url, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${"eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJkNDhkMDg4NzU4MmI4NjY2NDMwMTQwZjRkODk3NTc3MiIsIm5iZiI6MTU0MzIzODEwMC42NTY5OTk4LCJzdWIiOiI1YmZiZjFkNDkyNTE0MTEzMjkwMGRmOGYiLCJzY29wZXMiOlsiYXBpX3JlYWQiXSwidmVyc2lvbiI6MX0.7RInpLgb8h4m-d_7UfWp89EaaZIw4CUBxQLq4vKUjGs"}`
    }
  });
  const { results } = await response.json();
  return results;
};
const getSearchMovie = async (query = "") => {
  const url = `https://api.themoviedb.org/3/search/movie?language=ko-KR&page=1&query=${query}`;
  const response = await fetch(url, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${"eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJkNDhkMDg4NzU4MmI4NjY2NDMwMTQwZjRkODk3NTc3MiIsIm5iZiI6MTU0MzIzODEwMC42NTY5OTk4LCJzdWIiOiI1YmZiZjFkNDkyNTE0MTEzMjkwMGRmOGYiLCJzY29wZXMiOlsiYXBpX3JlYWQiXSwidmVyc2lvbiI6MX0.7RInpLgb8h4m-d_7UfWp89EaaZIw4CUBxQLq4vKUjGs"}`
    }
  });
  const { results } = await response.json();
  return results;
};
const getHandler = () => {
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
  return handler;
};
const state = (initialState) => {
  const handler = getHandler();
  const innerState = new Proxy(
    {
      value: initialState
    },
    handler
  );
  return { value: innerState, ...handler };
};
const AppHeader = ({ inputState }) => {
  const { value: headerState, subscribe } = state([]);
  const fetchData = async () => {
    const data = await getTopRatedMovies();
    headerState.value = data;
  };
  const container = document.createDocumentFragment();
  const header = document.createElement("header");
  container.appendChild(header);
  const handleKeyDown = (e) => {
    if (e.code === "Enter") {
      e.preventDefault();
      inputState.value = e.target.value;
    }
  };
  const render = () => {
    var _a, _b;
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
        <div class="logo-and-searchbox">
          <h1 class="logo">
            <img src="logo.png" alt="MovieList" />
            </h1>
            <div class="search-icon-box">
              <input class="search" type="text"/>
              <svg 
                class="search-icon" 
              xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-search"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
            </div>
            <div></div>
        </div>
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
    const inputElement = header.querySelector(".search");
    inputElement.addEventListener("keydown", handleKeyDown);
  };
  fetchData();
  render();
  subscribe(() => {
    render();
  });
  return container;
};
class Movie {
  constructor({ title, posterPath, voteAverage }) {
    __publicField(this, "title");
    __publicField(this, "posterPath");
    __publicField(this, "voteAverage");
    this.title = title;
    this.posterPath = posterPath;
    this.voteAverage = voteAverage;
  }
  get getTitle() {
    return this.title;
  }
  get getPosterPath() {
    return this.posterPath;
  }
  get getVoteAverage() {
    return this.voteAverage;
  }
  render() {
    return `<li>
              <div class="item">
                <img
                  class="thumbnail"
                  src="
https://media.themoviedb.org/t/p/w440_and_h660_face${this.posterPath}"
                  alt="인사이드 아웃 2"
                />
                <div class="item-desc">
                  <p class="rate">
                    <img src="star_empty.png" class="star" />
                    <span>${this.voteAverage}</span>
                  </p>
                  <strong>${this.title}</strong>
                </div>
              </div>
            </li>`;
  }
}
const ThumbnailList = ({ mainState }) => {
  var _a;
  return toElement({
    domString: `<ul class="thumbnail-list">
    ${(_a = mainState.value) == null ? void 0 : _a.map((result) => {
      const {
        title,
        poster_path: posterPath,
        vote_average: voteAverage
      } = result;
      return new Movie({
        title,
        posterPath,
        voteAverage
      }).render();
    }).join("")}</ul>`
  });
};
const tabs = ["상영 중", "인기순", "평점순", "상영 예정"];
const MainTabs = () => toElement({
  domString: `<ul class="tab">
    ${tabs.map(
    (tab, index) => `<li>
         <a href="#">
          <div class="tab-item ${index === 0 ? "selected" : ""}"><h3>${tab}</h3></div>
        </a>
      </li>`
  ).join("")}
    </ul>`
});
const AppMain = ({ inputState, inputStateSubscribe }) => {
  const { value: mainState, subscribe } = state([]);
  const { value: pageState } = state(1);
  const container = document.createDocumentFragment();
  const div = document.createElement("div");
  div.classList.add("container");
  div.innerHTML = /* html */
  `
    <main>
      <div class="main-tabs">
      </div>
      <h2>지금 인기 있는 영화</h2>  
      <section>
      </section>
      <button class="add-more">더보기</button>
    </main>
  `;
  const fetchNextPage = async () => {
    pageState.value += 1;
    const data = await getFavoriteMovies(pageState.value);
    mainState.value = [...mainState.value, ...data];
  };
  div.querySelector(".main-tabs").appendChild(MainTabs());
  div.querySelector(".add-more").addEventListener("click", fetchNextPage);
  container.appendChild(div);
  const fetchData = async () => {
    const data = await getFavoriteMovies(pageState.value);
    mainState.value = data;
  };
  fetchData();
  const render = async () => {
    div.querySelector("section").innerHTML = "";
    div.querySelector("section").appendChild(
      ThumbnailList({
        mainState
      })
    );
  };
  render();
  inputStateSubscribe(async () => {
    const data = await getSearchMovie(inputState.value);
    mainState.value = data;
  });
  subscribe(() => {
    render();
  });
  return container;
};
window.addEventListener("load", () => {
  const app = document.querySelector("#app");
  const { value: inputState, subscribe: inputStateSubscribe } = state("");
  if (app) {
    app.appendChild(
      AppHeader({
        inputState
      })
    );
    app.appendChild(
      AppMain({
        inputState,
        inputStateSubscribe
      })
    );
    app.appendChild(AppFooter());
  }
});
