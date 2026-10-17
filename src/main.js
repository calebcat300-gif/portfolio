
import "./style.css";
import { createIcons, VolumeX, Volume2 } from "lucide";

const music = new Audio("/music.mp3");
music.loop = true;

const musicButton = document.getElementById("music-toggle");

function renderMusicIcon() {
  musicButton.innerHTML = music.paused
    ? '<i data-lucide="volume-x" class="size-4"></i>'
    : '<i data-lucide="volume-2" class="size-4"></i>';

  createIcons({
    icons: {
      VolumeX,
      Volume2,
    },
  });
}

musicButton.addEventListener("click", async () => {
  if (music.paused) {
    await music.play();
  } else {
    music.pause();
  }

  renderMusicIcon();
});

/*
async function getDiscordProfile() {
  const url = "https://api.lanyard.rest/v1/users/1439728287608999956";

  try {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error("Failed to fetch Discord presence");
    }

    const result = await response.json();

    if (!result.success) {
      throw new Error("Lanyard returned an error");
    }

    const user = result.data.discord_user;
    const activities = result.data.activities ?? [];

    document.getElementById("display_name").textContent =
      user.display_name ?? user.global_name ?? user.username;

    document.getElementById("username").textContent =
      `@${user.username}`;

    document.getElementById("avatar").src =
      `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png`;

    const card = document.getElementById("activity");
    const icon = document.getElementById("activity-icon");
    const name = document.getElementById("activity-name");
    const details = document.getElementById("activity-details");
    const state = document.getElementById("activity-state");

    const activity = activities.find(
      (item) => item.type === 0
    );

    if (!activity) {
      card.classList.add("hidden");
      return;
    }

    card.classList.remove("hidden");

    name.textContent = activity.name;
    details.textContent = activity.details ?? "";
    state.textContent = activity.state ?? "";

    details.classList.toggle("hidden", !activity.details);
    state.classList.toggle("hidden", !activity.state);

    const image = activity.assets?.large_image;

    if (image && image.startsWith("mp:")) {
      icon.src = `https://media.discordapp.net/${image.slice(3)}`;
      icon.classList.remove("hidden");
    } else if (image && activity.application_id) {
      icon.src = `https://cdn.discordapp.com/app-assets/${activity.application_id}/${image}.png`;
      icon.classList.remove("hidden");
    } else {
      icon.removeAttribute("src");
      icon.classList.add("hidden");
    }

    icon.onerror = () => {
      icon.classList.add("hidden");
    };

  } catch (error) {
    console.error("Discord presence error:", error);
    document.getElementById("activity").classList.add("hidden");
  }
}

getDiscordProfile();
*/

const DISCORD_ID = "1439728287608999956";
const API_URL = `https://api.lanyard.rest/v1/users/${DISCORD_ID}`;
const SOCKET_URL = "wss://api.lanyard.rest/socket";

const card = document.getElementById("activity");
const icon = document.getElementById("activity-icon");
const name = document.getElementById("activity-name");
const details = document.getElementById("activity-details");
const state = document.getElementById("activity-state");

let previousActivity = null;
let reconnectDelay = 1000;

function getActivityImage(activity) {
  const image = activity.assets?.large_image;

  if (!image) return null;

  if (image.startsWith("mp:")) {
    return `https://media.discordapp.net/${image.slice(3)}`;
  }

  if (activity.application_id) {
    return `https://cdn.discordapp.com/app-assets/${activity.application_id}/${image}.png`;
  }

  return null;
}

function animateCard() {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    return;
  }

  card.getAnimations().forEach((animation) => animation.cancel());

  card.animate(
    [
      { opacity: 0.5, transform: "translateY(5px)" },
      { opacity: 1, transform: "translateY(0)" },
    ],
    {
      duration: 350,
      easing: "ease-out",
    }
  );
}

function updatePresence(data) {
  const user = data.discord_user;

  if (user) {
    document.getElementById("display_name").textContent =
      user.display_name ?? user.global_name ?? user.username;

    document.getElementById("username").textContent =
      `@${user.username}`;

    const avatar = document.getElementById("avatar");

    avatar.src = user.avatar
      ? `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png`
      : `https://cdn.discordapp.com/embed/avatars/0.png`;
  }

  const activity = (data.activities ?? []).find(
    (item) => item.type === 0
  );

  if (!activity) {
    card.classList.add("hidden");
    previousActivity = null;
    return;
  }

  const imageUrl = getActivityImage(activity);

  const activityKey = JSON.stringify([
    activity.name,
    activity.details,
    activity.state,
    imageUrl,
  ]);

  if (activityKey === previousActivity) return;

  previousActivity = activityKey;

  name.textContent = activity.name;
  details.textContent = activity.details ?? "";
  state.textContent = activity.state ?? "";

  details.classList.toggle("hidden", !activity.details);
  state.classList.toggle("hidden", !activity.state);

  if (imageUrl) {
    icon.src = imageUrl;
    icon.classList.remove("hidden");
  } else {
    icon.removeAttribute("src");
    icon.classList.add("hidden");
  }

  icon.onerror = () => {
    icon.classList.add("hidden");
  };

  card.classList.remove("hidden");
  animateCard();
}

async function loadInitialPresence() {
  try {
    const response = await fetch(API_URL);

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const result = await response.json();

    if (result.success && result.data) {
      updatePresence(result.data);
    }
  } catch (error) {
    console.error("Initial Discord fetch failed:", error);
  }
}

function connectLanyard() {
  const socket = new WebSocket(SOCKET_URL);
  let heartbeat = null;

  socket.onopen = () => {
    reconnectDelay = 1000;
  };

  socket.onmessage = (event) => {
    const message = JSON.parse(event.data);

    if (message.op === 1) {
      socket.send(
        JSON.stringify({
          op: 2,
          d: {
            subscribe_to_id: DISCORD_ID,
          },
        })
      );

      heartbeat = setInterval(() => {
        if (socket.readyState === WebSocket.OPEN) {
          socket.send(JSON.stringify({ op: 3 }));
        }
      }, message.d.heartbeat_interval);
    }

    if (
      message.op === 0 &&
      (message.t === "INIT_STATE" ||
        message.t === "PRESENCE_UPDATE")
    ) {
      updatePresence(message.d);
    }
  };

  socket.onclose = () => {
    clearInterval(heartbeat);

    setTimeout(connectLanyard, reconnectDelay);

    reconnectDelay = Math.min(reconnectDelay * 2, 30000);
  };

  socket.onerror = () => {
    socket.close();
  };
}

loadInitialPresence();
connectLanyard();
renderMusicIcon();
