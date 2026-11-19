# 40C3 Presale Launcher

An unofficial, static Svelte and TypeScript helper for the 40C3 public presale on **19 November 2026 at 20:00:00 CET (19:00 UTC)**.

```sh
mise install
mise exec -- pnpm install
mise exec -- pnpm dev
```

Open the local URL that Vite prints. **Run 10-second rehearsal** to test a same-tab launch without contacting the ticket shop. **Arm timed launch** opens the official shop once at or after the scheduled time according to your device clock. Keep the tab visible and the device awake. This is not a guarantee of server arrival time, queue position, or ticket availability. The launcher never polls the shop or touches the queue or checkout.

**Open official shop now** opens a new tab without canceling an armed launch. Return to the countdown tab to keep it visible, or click **Cancel timed launch** to disarm it.

```sh
mise exec -- pnpm check
mise exec -- pnpm test
mise exec -- pnpm build
```

The production output is in `dist/`. Relative asset paths let it work at a GitHub Pages project subpath once you set up deployment.
