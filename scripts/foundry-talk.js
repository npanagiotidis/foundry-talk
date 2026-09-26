const MODULE_ID = "foundry-talk";
const { ApplicationV2, HandlebarsApplicationMixin } = foundry.applications.api;

class TalkWindow extends HandlebarsApplicationMixin(ApplicationV2) {
  static DEFAULT_OPTIONS = {
    id: "foundry-talk-window",
    tag: "section",
    classes: [MODULE_ID, "talk-window"],
    position: {
      width: 720,
      height: 560
    },
    window: {
      title: "Nextcloud Talk",
      icon: "fas fa-video",
      resizable: true
    }
  };

  static PARTS = {
    main: {
      template: `modules/${MODULE_ID}/templates/talk-window.hbs`
    }
  };

  async _prepareContext() {
    return { talkUrl: getTalkUrl() };
  }
}

function getTalkUrl() {
  const configuredUrl = game.settings.get(MODULE_ID, "talkUrl").trim();

  if (!configuredUrl) {
    return null;
  }

  try {
    const url = new URL(configuredUrl);
    if (!["https:", "http:"].includes(url.protocol)) {
      throw new TypeError("Unsupported URL protocol");
    }
    return url.href;
  } catch {
    return null;
  }
}

function openTalk() {
  if (!getTalkUrl()) {
    ui.notifications.warn("Configure a valid Nextcloud Talk room URL in the Foundry Talk module settings first.");
    return;
  }

  new TalkWindow().render({ force: true });
}

function mountTalkLauncher() {
  if (document.getElementById(`${MODULE_ID}-launcher`)) {
    return;
  }

  const button = document.createElement("button");
  button.id = `${MODULE_ID}-launcher`;
  button.className = `${MODULE_ID}__launcher`;
  button.type = "button";
  button.title = "Open Nextcloud Talk";
  button.innerHTML = '<i class="fas fa-video" aria-hidden="true"></i><span>Talk</span>';
  button.addEventListener("click", openTalk);
  document.body.append(button);
}

Hooks.once("init", () => {
  game.settings.register(MODULE_ID, "talkUrl", {
    name: "Nextcloud Talk room URL",
    hint: "The Talk conversation URL to display inside Foundry. Nextcloud must allow this Foundry origin to embed the room.",
    scope: "world",
    config: true,
    type: String,
    default: "",
    onChange: () => ui.controls?.render({ force: true })
  });

  game.keybindings.register(MODULE_ID, "openTalk", {
    name: "Open Nextcloud Talk",
    hint: "Open the configured Nextcloud Talk room.",
    editable: [{ key: "KeyT", modifiers: ["CONTROL", "SHIFT"] }],
    onDown: () => {
      openTalk();
      return true;
    },
    restricted: false
  });
});

Hooks.once("ready", mountTalkLauncher);

Hooks.on("getSceneControlButtons", (controls) => {
  controls[MODULE_ID] = {
    name: MODULE_ID,
    title: "Nextcloud Talk",
    icon: "fas fa-video",
    order: 999,
    visible: Boolean(getTalkUrl()),
    tools: {
      openTalk: {
        name: "openTalk",
      title: "Open Nextcloud Talk",
      icon: "fas fa-video",
      button: true,
      onClick: openTalk
      }
    }
  };
});