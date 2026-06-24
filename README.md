# mthan-src-nextjs

## Build

Create the standalone bundle and version manifest in `build/`:

```bash
bash scripts/build.sh
```

This writes:

- `build/latest.zip`
- `build/version.json`

`build/version.json` includes:

- `version`: app version from `package.json`
- `buildVersion`: build tag in the form `vYYYYMMDDHHMMSS`
- `zip`: generated zip file name

## Install

Install the app bundle as root:

```bash
curl -fsSL https://raw.githubusercontent.com/antoine-mai/mthan-src-nextjs/main/scripts/install.sh | sudo bash
```

This will:

- install `node` automatically on apt-based systems if it is missing
- always download `build/latest.zip` from GitHub raw
- extract the zip into `/opt/mthan-src/nextjs`
- create `mthan-src-nextjs@.service` in `/etc/systemd/system`
- create per-user env files at `~/.mthan-src/nextjs/.env` on first start
- print a startup line in the systemd journal with user and port

Install and start a specific user instance in one shot:

```bash
curl -fsSL https://raw.githubusercontent.com/antoine-mai/mthan-src-nextjs/main/scripts/install.sh | sudo bash -s -- --user <user>
```

This will do everything above, then also:

- enable and start `mthan-src-nextjs@<user>`
- write the first `~/.mthan-src/nextjs/.env` for that user if missing
- print the service startup log to the terminal

## Run

Enable and start an instance for a user:

```bash
sudo systemctl enable --now mthan-src-nextjs@<user>
```

Override runtime settings by creating:

```bash
~/.mthan-src/nextjs/.env
```

Typical values:

```bash
PORT=3000
```

Check the startup line with:

```bash
journalctl -u mthan-src-nextjs@<user> -n 50
```
