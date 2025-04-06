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
const getSearchMovie = async (query = "", index = 1) => {
  const url = `https://api.themoviedb.org/3/search/movie?language=ko-KR&page=1&query=${query}&page=${index}`;
  const response = await fetch(url, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${"eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJkNDhkMDg4NzU4MmI4NjY2NDMwMTQwZjRkODk3NTc3MiIsIm5iZiI6MTU0MzIzODEwMC42NTY5OTk4LCJzdWIiOiI1YmZiZjFkNDkyNTE0MTEzMjkwMGRmOGYiLCJzY29wZXMiOlsiYXBpX3JlYWQiXSwidmVyc2lvbiI6MX0.7RInpLgb8h4m-d_7UfWp89EaaZIw4CUBxQLq4vKUjGs"}`
    }
  });
  const { results } = await response.json();
  return results;
};
const getMovieDetail = async (movieId = "") => {
  const url = `https://api.themoviedb.org/3/movie/${movieId}?language=ko-KR`;
  const response = await fetch(url, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${"eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJkNDhkMDg4NzU4MmI4NjY2NDMwMTQwZjRkODk3NTc3MiIsIm5iZiI6MTU0MzIzODEwMC42NTY5OTk4LCJzdWIiOiI1YmZiZjFkNDkyNTE0MTEzMjkwMGRmOGYiLCJzY29wZXMiOlsiYXBpX3JlYWQiXSwidmVyc2lvbiI6MX0.7RInpLgb8h4m-d_7UfWp89EaaZIw4CUBxQLq4vKUjGs"}`
    }
  });
  const data = await response.json();
  return data;
};
const eventEmitter = new EventTarget();
const createRenderer = () => {
  return {
    state(key, initialState) {
      const initState = {
        value: initialState
      };
      const handler = {
        set(target, prop, value) {
          target[prop] = value;
          eventEmitter.dispatchEvent(new CustomEvent(key));
          return true;
        }
      };
      const proxyState = new Proxy(initState, handler);
      const setState = (newValue) => {
        proxyState.value = newValue;
      };
      return [proxyState, setState];
    }
  };
};
const renderer = createRenderer();
const replaceNewContainer = (rootContainer, render) => {
  const newContainer = render();
  rootContainer.replaceWith(newContainer);
  return newContainer;
};
const toElement = (htmlString) => {
  const div = document.createElement("div");
  div.innerHTML = htmlString.trim();
  return div.firstChild;
};
const setMovieStarScore = (movieId, number) => {
  localStorage.setItem(movieId, number);
};
const getMovieStarScore = (movieId) => {
  const value = localStorage.getItem(movieId);
  if (value) {
    return value;
  }
  setMovieStarScore(movieId, 0);
  return value;
};
const MyStarScoreComponent = (movieId) => {
  const [scoreState, setScoreState] = renderer.state("my-star-score", getMovieStarScore(movieId) ?? 0);
  const handleStarScoreBox = (e) => {
    if (e.target.tagName === "IMG") {
      setScoreState(e.target.dataset.score);
      setMovieStarScore(movieId, e.target.dataset.score);
    }
  };
  const render = () => {
    const container = toElement(
      `<div>
                <div class="starScores">
                    ${Array.from({ length: 5 }).fill(0).map((val, index) => {
        const starScore = (index + 1) * 2;
        return `<img src="${scoreState.value >= starScore ? "star_filled.png" : "star_empty.png"}" class="star" data-score="${starScore}">`;
      }).join("")}  <span class="score">${scoreState.value}</span>
                </div>
                
             </div>
            `
    );
    const starScoreBox = container.querySelector(".starScores");
    starScoreBox.addEventListener("click", handleStarScoreBox);
    return container;
  };
  let rootContainer = render();
  eventEmitter.addEventListener("my-star-score", () => {
    rootContainer = replaceNewContainer(rootContainer, render);
  });
  return rootContainer;
};
const AppDetail = () => {
  const [detailState, setDetailState] = renderer.state("app-detail", false);
  const [detailData, setDetailData] = renderer.state("app-detail-data", {});
  const fetchData = async (movieId) => {
    const data = await getMovieDetail(movieId);
    setDetailData({ ...data });
  };
  const render = () => {
    const {
      id,
      title,
      genres,
      release_date,
      backdrop_path,
      vote_average,
      overview
    } = detailData.value;
    const container = toElement(
      `
            <div>
                <div class="modal-background ${detailState.value ? "active" : ""}" id="modalBackground">
                    <div class="modal">
                        <button class="close-modal" id="closeModal">
                        <img src="modal_button_close.png" />
                        </button>
                        <div class="modal-container">
                            <div class="modal-image">
                                <img
                                src="https://image.tmdb.org/t/p/original${backdrop_path ?? ""}"
                                />
                            </div>
                            <div class="modal-description">
                                <h2>${title}</h2>
                                <p class="category">
                                ${release_date} · ${genres == null ? void 0 : genres.map((genre) => genre.name).join(",")}
                                </p>
                                <p class="rate">
                                <img src="star_filled.png" class="star" /><span
                                    >${vote_average}</span
                                >
                                </p>
                                <hr />
                                <div>
                                    <div>내 별점</div> 
                                    <div class="my-score-box">
                                    </div> 
                                
                                </div>
                                <hr />
                                <p class="detail">
                                ${overview}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            `
    );
    const closeButton = container.querySelector(".close-modal");
    const scoreBox = container.querySelector(".my-score-box");
    scoreBox.appendChild(MyStarScoreComponent(id));
    closeButton.addEventListener("click", () => {
      setDetailState(false);
      const newContainer = render();
      rootContainer.replaceWith(newContainer);
      rootContainer = newContainer;
    });
    return container;
  };
  let rootContainer = render();
  eventEmitter.addEventListener("app-detail-info", (event) => {
    fetchData(event.detail.id);
    setDetailState(!detailState.value);
    rootContainer = replaceNewContainer(rootContainer, render);
  });
  eventEmitter.addEventListener("app-detail-data", () => {
    rootContainer = replaceNewContainer(rootContainer, render);
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && detailState.value) {
      setDetailState(false);
      rootContainer = replaceNewContainer(rootContainer, render);
    }
  });
  return rootContainer;
};
const TopRatedMoviePoster = (topRatedMovie) => topRatedMovie == null ? void 0 : topRatedMovie.slice(0, 1).map((result) => {
  const { poster_path: posterPath } = result;
  return (
    /* html */
    `<div class="overlay" aria-hidden="true"
        style="background-image:url('https://media.themoviedb.org/t/p/w1920_and_h1080_face${posterPath}')"
      ></div>`
  );
}).join("");
const TopRatedMovieInfo = (topRatedMovie) => topRatedMovie == null ? void 0 : topRatedMovie.slice(0, 1).map((result) => {
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
}).join("");
const AppHeader = ({ setInputState }) => {
  const [headerState, setState] = renderer.state("app-header", []);
  const fetchData = async () => {
    const data = await getTopRatedMovies();
    setState(data);
  };
  fetchData();
  const render = () => {
    const container = toElement(
      `<header>
          <div class="background-container">
              ${TopRatedMoviePoster(headerState.value)}
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
                ${TopRatedMovieInfo(headerState.value)}
                </div>
              </div>
            </div>
        </header>`
    );
    const handleKeyDown = (e) => {
      if (e.code === "Enter") {
        e.preventDefault();
        setInputState(e.target.value);
        console.log(e.target.value);
      }
    };
    const inputElement = container.querySelector(".search");
    inputElement.addEventListener("keydown", handleKeyDown);
    return container;
  };
  let rootContainer = render();
  eventEmitter.addEventListener("app-header", () => {
    rootContainer = replaceNewContainer(rootContainer, render);
  });
  return rootContainer;
};
const Movie = ({ id, title, posterPath, voteAverage }) => {
  const render = () => {
    const container = toElement(`<li>
              <div class="item" id=${id}>
                <img
                  class="thumbnail"
                  src="
https://media.themoviedb.org/t/p/w440_and_h660_face${posterPath}"
                  alt="인사이드 아웃 2"
                />
                <div class="item-desc">
                  <p class="rate">
                    <img src="star_empty.png" class="star" />
                    <span>${voteAverage}</span>
                  </p>
                  <strong>${title}</strong>
                </div>
              </div>
            </li>`);
    return container;
  };
  let rootContainer = render();
  return rootContainer;
};
const ThumbnailList = (list) => {
  const render = () => {
    const container = toElement(`<div>
      <ul id="test" class="thumbnail-list">
      ${list == null ? void 0 : list.map((result) => {
      const {
        id,
        title,
        poster_path: posterPath,
        vote_average: voteAverage
      } = result;
      return Movie({
        id,
        title,
        posterPath,
        voteAverage
      }).outerHTML;
    }).join("")}</ul>
        </div>
      `);
    const handleDetail = (e) => {
      const detailEvent = new CustomEvent("app-detail-info", {
        detail: {
          id: e.target.closest(".item").id
        }
      });
      eventEmitter.dispatchEvent(detailEvent);
    };
    container.addEventListener("click", handleDetail);
    return container;
  };
  let rootContainer = render();
  return rootContainer;
};
const callback = (entries, observer, fn) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting && entry.intersectionRatio > 0) {
      fn();
    }
  });
};
const options = {
  root: null,
  // Use the viewport as the root
  rootMargin: "0px 0px -50px 0px",
  threshold: 0
  // Trigger when 50% of the target is visible
};
const AppMain = ({ inputState }) => {
  const [mainState, setState] = renderer.state("app-main", []);
  const [pageState, setPageState] = renderer.state("---", 1);
  const fetchData = async (page) => {
    if (inputState.value !== "") {
      const movies = await getSearchMovie(inputState.value, page);
      setState([...mainState.value, ...movies]);
      return;
    }
    const data = await getFavoriteMovies(page);
    setState([...mainState.value, ...data]);
  };
  fetchData(pageState.value);
  const render = () => {
    const container = toElement(`
      <main >
        <div class="container">
          <h2>지금 인기 있는 영화</h2>  
          <section>
          </section>
          <div class="more"></div>
        </div>
      </main>`);
    const handleClick = () => {
      if (pageState.value >= 3) {
        return;
      }
      setPageState(pageState.value + 1);
      fetchData(pageState.value);
    };
    const inputElement = container.querySelector(".add-more");
    inputElement == null ? void 0 : inputElement.addEventListener("click", handleClick);
    const sectionElement = container.querySelector("section");
    sectionElement.firstChild.replaceWith(ThumbnailList(mainState.value));
    const observer = new IntersectionObserver(
      (entries, observer2) => callback(
        entries,
        observer2,
        () => {
          setPageState(pageState.value + 1);
          fetchData(pageState.value);
        }
      ),
      options
    );
    observer.observe(container.querySelector(".more"));
    return container;
  };
  let rootContainer = render();
  eventEmitter.addEventListener("app-main", () => {
    rootContainer = replaceNewContainer(rootContainer, render);
  });
  async function handleInputAsync() {
    const movies = await getSearchMovie(inputState.value);
    setState(movies);
  }
  eventEmitter.addEventListener("app-input", () => {
    handleInputAsync();
  });
  return rootContainer;
};
window.addEventListener("load", () => {
  const app = document.querySelector("#app");
  const [inputState, setInputState] = renderer.state("app-input", "");
  const AppHeaderComponent = AppHeader({
    setInputState
  });
  const AppMainComponent = AppMain({
    inputState
  });
  const AppDetailComponent = AppDetail();
  if (app) {
    app.appendChild(AppHeaderComponent);
    app.appendChild(AppMainComponent);
    app.appendChild(AppDetailComponent);
  }
});
