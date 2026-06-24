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

Install the bundle as root:

```bash
sudo ./scripts/install.sh
```

The installer will:

- require `node` to be available
- use `build/latest.zip` from this repository
- extract the zip into `/opt/mthan-src/nextjs`
- create `mthan-src-nextjs@.service` in `/etc/systemd/system`
- read per-user env files from `~/.mthan-src/nextjs/env`

## Run

Enable and start an instance for a user:

```bash
sudo systemctl enable --now mthan-src-nextjs@<user>
```

Override runtime settings by creating:

```bash
~/.mthan-src/nextjs/env
```

Typical values:

```bash
PORT=3000
HOSTNAME=0.0.0.0
```
