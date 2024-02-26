document.addEventListener("DOMContentLoaded", function() {
  function getRandomPlayer() {
    const wistiaPlayers = [
      "a9753zif3b", // Wistia Version A
    ];

    const players = [
      ...wistiaPlayers,
      "65cc0feb44252100082cc183", // VTurb Version B - Without background
      "65cc100244252100082cc18c" // VTurb Version C - With background
    ];

    const player_id = players[Math.floor(Math.random() * players.length)];
    const isWistia = wistiaPlayers.includes(player_id);

    return { player_id, isWistia };
  }

  function changeUTMSource(value = "") {
    const links = document.querySelectorAll("a");

    links.forEach((buttonLink) => {
      if (!buttonLink.search.includes("vturbC") && !buttonLink.search.includes("vturbB") && !buttonLink.search.includes("wistia")) {
        const buttonParams = new URLSearchParams(buttonLink.search);

        buttonParams.set("teste_vturb", value);
        buttonLink.search = buttonParams.toString();
      }
    });
  }

  function loadWistiaPlayer(container, wistia_id = "") {
    if (!container || !wistia_id) return;

    const script1 = document.createElement('script');
    script1.src = `https://fast.wistia.com/embed/medias/${wistia_id}.jsonp`;
    script1.async = true;

    const script2 = document.createElement('script');
    script2.src = "https://fast.wistia.com/assets/external/E-v1.js";
    script2.async = true;

    const divEmbed = document.createElement('div');
    divEmbed.classList.add('wistia_embed', `wistia_async_${wistia_id}`);
    divEmbed.setAttribute('data-videoFoam', 'true');
    divEmbed.style.height = '100%';
    divEmbed.style.position = 'relative';
    divEmbed.style.width = '100%';

    const divInnerWrapper = document.createElement('div');
    divInnerWrapper.classList.add('wistia_responsive_wrapper');
    divInnerWrapper.style.height = '100%';
    divInnerWrapper.style.left = '0';
    divInnerWrapper.style.position = 'absolute';
    divInnerWrapper.style.top = '0';
    divInnerWrapper.style.width = '100%';
    divInnerWrapper.appendChild(divEmbed);

    const divWrapper = document.createElement('div');
    divWrapper.classList.add('wistia_responsive_padding');
    divWrapper.style.padding = '56.25% 0 0 0';
    divWrapper.style.position = 'relative';
    divWrapper.appendChild(divInnerWrapper);

    container.appendChild(script1);
    container.appendChild(script2);
    container.appendChild(divWrapper);

    changeUTMSource("wistia");
  }

  function loadVTurbPlayer(container, player_id = "") {
    if (!container || !player_id) return;

    const embedDiv = document.createElement("div");
    embedDiv.id = `vid_${player_id}`;
    embedDiv.style = "position:relative;width:100%;padding: 56.25% 0 0;";
    embedDiv.innerHTML = `
    <img id="thumb_${player_id}" src="https://images.converteai.net/b5e8472d-3421-4675-a219-1ae1b636b21f/players/${player_id}/thumbnail.jpg" style="position:absolute;top:0;left:0;width:100%;height:100%;object-fit:cover;display:block;">
    
    <div id="backdrop_${player_id}" style="position:absolute;top:0;width:100%;height:100%;-webkit-backdrop-filter:blur(5px);backdrop-filter:blur(5px);"></div>
  `;

    const script = document.createElement("script");
    script.type = "text/javascript";
    script.id = `scr_${player_id}`;
    script.src = `https://scripts.converteai.net/b5e8472d-3421-4675-a219-1ae1b636b21f/players/${player_id}/player.js`;
    script.async = true;

    container.appendChild(embedDiv);
    container.appendChild(script);

    const name = player_id === "65cc0feb44252100082cc183" ? "vturbB" : "vturbC";

    changeUTMSource(name);
  }

  function loadPlayer(player_id = "", isWistia = false) {
    const container = document.getElementById("vt-custom-abtest-container");

    if (isWistia) return loadWistiaPlayer(container, player_id);

    return loadVTurbPlayer(container, player_id);
  }

  async function getVturbInstanceBy(player_id = "") {
    return new Promise((resolve) => {
      const interval = setInterval(() => {
        if (!window.smartplayer || !window.smartplayer.instances || !window.smartplayer.instances.length) return;

        const player = window.smartplayer.instances.find((instance) => instance.options.id === player_id);

        if (!player) return;

        clearInterval(interval);

        resolve(player);
      }, 100);
    });
  }

  async function getWistiaInstanceBy(player_id = "") {
    return new Promise((resolve) => {
      const interval = setInterval(() => {
        if (!window.Wistia || !window.Wistia.api) return;

        const player = window.Wistia.api(player_id)

        if (!player) return;

        clearInterval(interval);

        resolve(player);
      }, 100);
    });
  }

  const toggleOverlay = (player_id = "", show = false) => {
    const overlay = document.querySelector(".vt-custom-pause-overlay");

    if (!overlay) return;

    overlay.setAttribute("data-visible", show.toString());
  }

  async function vturbPauseOverlay(player_id = "") {
    const player = await getVturbInstanceBy(player_id);
    const overlay = document.querySelector(".vt-custom-pause-overlay");

    player.on("pause", () => toggleOverlay(player_id, true));
    player.on("play", () => toggleOverlay(player_id, false));

    if (overlay) {
      overlay.addEventListener("click", () => player.play());
    }
  }

  async function wistiaPauseOverlay(player_id = "") {
    const player = await getWistiaInstanceBy(player_id);
    const overlay = document.querySelector(".vt-custom-pause-overlay");

    player.bind("pause", () => toggleOverlay(player_id, true));
    player.bind("play", () => {
      toggleOverlay(player_id, false);

      const video = player.elem();

      if (video && video.muted) video.muted = false;
    });

    if (overlay) {
      overlay.addEventListener("click", () => player.play());
    }
  }

  const { player_id, isWistia } = getRandomPlayer();

  loadPlayer(player_id, isWistia);

  console.log(`Player ID: ${player_id} - Is Wistia: ${isWistia}`);

  if (isWistia) wistiaPauseOverlay(player_id);
  else vturbPauseOverlay(player_id);
});
