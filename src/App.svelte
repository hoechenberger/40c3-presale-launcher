<script lang="ts">
  import { onMount } from 'svelte'
  import { formatCountdown, infoUrl, saleTime, scheduleLaunch, shopUrl } from './launch'

  const rehearsalComplete = new URLSearchParams(location.search).get('rehearsal') === 'complete'
  const localStart = new Intl.DateTimeFormat(undefined, {
    month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit', timeZoneName: 'short',
  }).format(saleTime)

  let now = $state(Date.now())
  let rehearsalAt = $state<number | null>(null)
  let armed = $state(false)
  let cancelLaunch: (() => void) | undefined
  const remaining = $derived((rehearsalAt ?? saleTime) - now)

  function disarm() {
    cancelLaunch?.()
    cancelLaunch = undefined
    armed = false
    rehearsalAt = null
  }

  function arm(target: number, destination: string) {
    armed = true
    cancelLaunch = scheduleLaunch(target, () => {
      cancelLaunch = undefined
      armed = false
      location.assign(destination)
    })
  }

  function armSale() {
    now = Date.now()
    if (!armed && now < saleTime) arm(saleTime, shopUrl)
  }

  function rehearse() {
    if (armed) return
    now = Date.now()
    rehearsalAt = now + 10_000
    const destination = new URL(location.href)
    destination.searchParams.set('rehearsal', 'complete')
    arm(rehearsalAt, destination.href)
  }

  onMount(() => {
    const ticker = setInterval(() => { now = Date.now() }, 100)
    return () => {
      clearInterval(ticker)
      disarm()
    }
  })
</script>

<main>
  <header>
    <span class="tag">40C3 / Ticket helper</span>
    <a href={infoUrl}>Official presale info</a>
  </header>

  {#if rehearsalComplete}
    <section class="panel">
      <p class="eyebrow">Rehearsal complete</p>
      <h1>The timed launch worked.</h1>
      <p>This tab navigated automatically. The ticket shop wasn’t contacted.</p>
      <a class="primary" href={location.pathname}>Back to presale countdown</a>
    </section>
  {:else}
    <section class="panel">
      <p class="eyebrow">Public presale / Round 3</p>
      <h1>40C3 presale</h1>
      <p class="sale-time"><time datetime="2026-11-19T20:00:00+01:00">Thursday, 19 November 2026 · 20:00:00 CET</time></p>
      <p class="local-time">Your local time: {localStart}</p>

      <div class="readout">
        <p class="eyebrow">{rehearsalAt !== null ? 'Rehearsal countdown' : 'Time until scheduled start'}</p>
        <div class="countdown" role="timer">{formatCountdown(remaining)}</div>
      </div>

      <p class="status" role="status">
        {#if rehearsalAt !== null}
          Rehearsal armed. This tab will open a test page, not the shop.
        {:else if armed}
          Launch armed. Keep this tab visible and your device awake.
        {:else if remaining <= 0}
          The scheduled start has passed. You can still open the official shop.
        {:else}
          Uses your device clock. Arming opens the shop once in this tab.
        {/if}
      </p>

      <div class="actions">
        {#if armed}
          <button type="button" class="primary" onclick={disarm}>Cancel timed launch</button>
        {:else if remaining > 0}
          <button type="button" class="primary" onclick={armSale}>Arm timed launch</button>
        {/if}
        <a class:primary={!armed && remaining <= 0} href={shopUrl} target="_blank" rel="noopener">Open official shop now</a>
        {#if !armed}
          <button type="button" class="secondary" onclick={rehearse}>Run 10-second rehearsal</button>
        {/if}
      </div>
    </section>
  {/if}

  <footer>Unofficial helper · Queue and checkout stay on CCC’s site.</footer>
</main>

<style>
  :global(html) {
    color-scheme: dark;
    background: #101416;
    color: #eef4ed;
    font: 1rem/1.5 system-ui, sans-serif;
  }

  :global(body) { margin: 0; }
  :global(a) { color: #b7f4a2; text-underline-offset: 0.22em; }
  :global(:focus-visible) { outline: 2px solid #eef4ed; outline-offset: 4px; }

  main { max-width: 46rem; margin: 0 auto; padding: 2rem clamp(1rem, 5vw, 2.5rem); }
  header { display: flex; flex-wrap: wrap; justify-content: space-between; gap: 0.75rem; margin-bottom: 1.5rem; }
  .tag, .eyebrow { color: #b7f4a2; font: 600 0.9rem/1.5 ui-monospace, monospace; text-transform: uppercase; }
  .panel { padding: clamp(1.25rem, 5vw, 3rem); background: #192022; border: 1px solid #465449; border-radius: 1rem; }
  h1 { margin: 0.2rem 0 0.5rem; font-size: clamp(2.2rem, 8vw, 4rem); line-height: 1.08; letter-spacing: -0.035em; }
  .eyebrow, .sale-time, .local-time { margin: 0; }
  .local-time, footer { color: #bac6bb; }
  .readout { margin-top: 1.75rem; padding: 1rem 0; border-block: 1px solid #465449; }
  .countdown { font: 700 clamp(2.5rem, 12vw, 6rem)/1.13 ui-monospace, monospace; letter-spacing: -0.055em; }
  .actions { display: flex; flex-wrap: wrap; align-items: center; gap: 0.75rem 1rem; }
  button, .primary { font: inherit; border-radius: 0.5rem; padding: 0.65rem 0.85rem; }
  button { cursor: pointer; }
  .primary { display: inline-block; background: #b7f4a2; border: 1px solid transparent; color: #101416; font-weight: 700; text-decoration: none; }
  .primary:hover { background: #d3ffc5; }
  .secondary { background: transparent; border: 1px solid #7e8f82; color: inherit; }
  .secondary:hover { background: #303b33; }
  footer { margin-top: 1rem; font-size: 0.9rem; }
</style>
