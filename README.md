# mthan-src-nextjs

## Build

Create the standalone bundle and version manifest in `build/`:

```bash
bash scripts/build.sh
```

This writes:

- `build/standalone.zip`
- `build/version.json`

`build/version.json` includes:

- `version`: app version from `package.json`
- `buildVersion`: build tag in the form `vYYYYMMDDHHMMSS`
- `zip`: generated zip file name

## Install

Install the bundle as root:

```bash
sudo bash scripts/install.sh build/standalone.zip
```

The installer will:

- require `node` to be available
- extract the zip into `/opt/mthan-src/nextjs`
- create `mthan-src-nextjs@.service` in `/etc/systemd/system`
- create optional per-user env files under `/etc/mthan-src/nextjs`

## Run

Enable and start an instance for a Linux user:

```bash
sudo systemctl enable --now mthan-src-nextjs@<user>
```

You can override runtime settings per user by creating:

```bash
/etc/mthan-src/nextjs/<user>.env
```

Typical values:

```bash
PORT=3000
HOSTNAME=0.0.0.0
```
