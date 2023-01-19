import EventEmitter from "eventemitter3";
import image from "../images/planet.svg";

export default class Application extends EventEmitter {
  static get events() {
    return {
      READY: "ready",
    };
  }

  constructor() {
    super();

    this._load();
    this.emit(Application.events.READY);
  }

  _render({name, terrain, population}) {
    return `
<article class="media">
  <div class="media-left">
    <figure class="image is-64x64">
      <img src="${image}" alt="planet">
    </figure>
  </div>
  <div class="media-content">
    <div class="content">
    <h4>${name}</h4>
      <p>
        <span class="tag">${terrain}</span> <span class="tag">${population}</span>
        <br>
      </p>
    </div>
  </div>
</article>
    `;
  }

  async _load(url) {

    console.log('_load called');

    let currentUrl = url || 'https://swapi.boom.dev/api/planets';

    this._startLoading();

    let results = await fetch(currentUrl);

    if (results.status === 200) {

      let data = await results.json();

      this._stopLoading();

      return this._create(data);
    }
  }

  _create(data) {

    console.log('_create called');

    data.results.forEach((planet) => {

      const box = document.createElement("div");
      box.classList.add("box");
      box.innerHTML = this._render({
        name: planet.name,
        terrain: planet.terrain,
        population: planet.population,
      });

      document.body.querySelector(".main").appendChild(box);

    });

    if (data.next !== null) {

      this._load(data.next);
    }
  }

  _startLoading() {

    console.log('_startLoading called');

    document.querySelector('.progress').style.display = 'block';
  }

  _stopLoading() {

    console.log('_stopLoading called');

    document.querySelector('.progress').style.display = 'none';
  }
}
