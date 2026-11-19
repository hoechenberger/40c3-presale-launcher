import assert from 'node:assert/strict'
import { test } from 'node:test'
import { formatCountdown, saleTime, scheduleLaunch } from '../src/launch.ts'

test('the official CET start maps to 19:00 UTC', () => {
  assert.equal(new Date(saleTime).toISOString(), '2026-11-19T19:00:00.000Z')
})

test('the countdown never shows zero early or goes negative', () => {
  assert.equal(formatCountdown(3_661_000), '01:01:01')
  assert.equal(formatCountdown(1), '00:00:01')
  assert.equal(formatCountdown(-1), '00:00:00')
})

test('the launch waits for the target, then fires only once', (context) => {
  context.mock.timers.enable({ apis: ['Date', 'setTimeout'], now: 0 })
  const launch = context.mock.fn()
  scheduleLaunch(1_234, launch)

  context.mock.timers.tick(1_233)
  assert.equal(launch.mock.callCount(), 0)
  context.mock.timers.tick(1)
  assert.equal(launch.mock.callCount(), 1)
  context.mock.timers.tick(10_000)
  assert.equal(launch.mock.callCount(), 1)
})

test('canceling an armed launch prevents navigation', (context) => {
  context.mock.timers.enable({ apis: ['Date', 'setTimeout'], now: 0 })
  const launch = context.mock.fn()
  const cancel = scheduleLaunch(2_000, launch)

  context.mock.timers.tick(1_500)
  cancel()
  context.mock.timers.tick(1_500)
  assert.equal(launch.mock.callCount(), 0)
})
