# Foundry Talk

Foundry Talk opens a configured Nextcloud Talk conversation in a Foundry VTT v14 window. It adds a persistent **Talk** launcher in the lower-right corner, a video control in the scene controls, and a configurable `Ctrl+Shift+T` keybinding.

## Installation

Copy this directory into Foundry's `Data/modules/foundry-talk` directory, then enable **Foundry Talk** for the world.

### Install from GitHub

After publishing a GitHub release, install from Foundry's **Add-on Modules > Install Module** dialog with this manifest URL:

```
https://github.com/OWNER/REPOSITORY/releases/latest/download/module.json
```

Replace `OWNER/REPOSITORY` with the GitHub repository path. The release workflow creates that manifest and a `foundry-talk.zip` download automatically whenever a tag beginning with `v` is pushed, such as `v0.1.0`.

To publish the project, create an empty GitHub repository, upload or push this project to it, then create and push a version tag. The **Release Foundry Talk** workflow will create the downloadable release assets.

## Configuration

Set **Nextcloud Talk room URL** in **Configure Settings > Module Settings > Foundry Talk**. This is normally the Talk conversation URL supplied by Nextcloud.

## Nextcloud requirement

The Talk page must be allowed to run in an iframe on your Foundry origin. Configure the Nextcloud external-call or reverse-proxy policy to allow the Foundry URL. The module sends the iframe permissions Talk needs:

- `camera`
- `microphone`
- `display-capture`
- `fullscreen`

For reliable camera and microphone access, serve both Foundry and Nextcloud with HTTPS. The module intentionally leaves authentication to Nextcloud, so users sign in to their own Talk accounts inside the embedded page.

If the Talk iframe is blank and the browser reports a `frame-ancestors` Content Security Policy error, configure Nextcloud or its reverse proxy to allow the public Foundry origin to embed Talk. Until then, use the **Open in Browser** link in the Talk window to join the call in a separate tab.

## Scope

This module embeds Talk rather than replacing Foundry's native AV client. That keeps Talk's signaling, TURN/Janus configuration, account authentication, and participant handling under Nextcloud's control.