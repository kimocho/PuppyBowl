// === Constants ===
const BASE = "https://fsa-puppy-bowl.herokuapp.com/api";
const COHORT = "/2505-sam"; // Make sure to change this!
const API = BASE + COHORT;

const div = document.querySelector('#app');
div.innerHTML = `
  <h1>Puppy Bowl</h1>
  <main>
  <section>
  <ul id="names"></ul>
  <h3>Invite a puppy</h3>
  <form>
    <label>Name</label><br><input id="name" placeholder = "required" required/><br>
    <label>Breed</label><br><input id="breed" placeholder = "required" required/><br>
    <label>Status</label><br><select id="select"><option>bench</option><option>field</option></select><br>
    <label>Image URL</label><br><input id="imageinput"/><br>
    <button id="invitepup">Invite puppy</button>
  </form>
  </section>
  <aside>
  <h3 id="h3select">Select a Player</h3>
  <ul id="details"></ul>
  </aside>
  </main>
`;
const names = document.querySelector('#names');
const details = document.querySelector('#details');
const inputName = document.querySelector('#name');
const inputBreed = document.querySelector('#breed');
const inputStatus = document.querySelector('#select');
const inputImage = document.querySelector('#imageinput');
const postPupButton = document.querySelector('#invitepup');
const h3select = document.querySelector('#h3select');

const state = {
  names: [],
};

const getting = async () => {
  try {
    const response = await fetch(`${API}/players`);
    const responseJson = await response.json();
    const players = responseJson.data.players;
    state.names = players;
    render();
  }
  catch (e) {
    console.error(e);
  }
}

const render = () => {
  names.innerHTML = '';
  state.names.forEach(obj => {
    const li = document.createElement('li');
    const image = document.createElement('img');
    image.setAttribute('src', obj.imageUrl);
    image.setAttribute('alt', obj.name);
    li.append(image, obj.name);
    names.appendChild(li);
    li.addEventListener('click', (event) => {
      event.preventDefault();
      detailsRendering(obj);
    });
  });
}

const detailsRendering = (obj) => {
  let { name, id, breed, status, imageUrl, teamId = "unassigned" } = obj;
  h3select.remove();
  details.innerHTML = `
    <li><img id = "clicked-img" src = ${imageUrl} alt = ${name}</li>
    <li>Name: ${name}</li>
    <li>ID: ${id}</li>
    <li>Breed: ${breed}</li>
    <li>Team ID: ${teamId}</li>
    <li>Status: ${status}</li>
    <button id="remove">Remove from roster</button>
  `;
  const removeButton = document.querySelector('#remove');
  removeButton.addEventListener('click', (event) => {
    //event.preventDefault();
    removeApi(id);
  });
}



const removeApi = async (idNum) => {
  try {
    const response = await fetch(`${API}/players/${idNum}`, { method: 'DELETE' });
    const deletedPlayer = await response.json();
    console.log(deletedPlayer);
    // state.names = state.names.filter(elem => {
    //   if (!elem) continue;
    // });
    render();
  }
  catch (e) {
    console.error(e);
  }
}


postPupButton.addEventListener('click', (event) => {
  event.preventDefault();
  postApi();
});

const postApi = async () => {
  try {
    const response = await fetch(`${API}/players`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: inputName.value, breed: inputBreed.value, status: inputStatus.value, imageUrl: inputImage.value })
    });
    const x = await response.json();
    state.names.push(inputName.value);

    render();
  }
  catch (e) {
    console.error(e);
  }
}

getting();