export const saleTime = Date.parse('2026-11-19T20:00:00+01:00')
export const shopUrl = 'https://tickets.events.ccc.de/40c3/'
export const infoUrl = 'https://events.ccc.de/congress/2026/infos/tickets/'

export function formatCountdown(milliseconds: number): string {
  const seconds = Math.max(0, Math.ceil(milliseconds / 1000))
  return [Math.floor(seconds / 3600), Math.floor(seconds / 60) % 60, seconds % 60]
    .map((part) => String(part).padStart(2, '0'))
    .join(':')
}

export function scheduleLaunch(target: number, launch: () => void): () => void {
  let timer: ReturnType<typeof setTimeout>

  function checkTime() {
    const remaining = target - Date.now()
    if (remaining <= 0) {
      launch()
    } else {
      timer = setTimeout(checkTime, Math.min(remaining, 1000))
    }
  }

  timer = setTimeout(checkTime, Math.min(Math.max(0, target - Date.now()), 1000))
  return () => clearTimeout(timer)
}
