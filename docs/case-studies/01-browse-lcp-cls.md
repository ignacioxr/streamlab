# Case study 1: Browse page LCP and CLS

## Goal

Bring mobile LCP on the browse page (`/`) under 2.5 s in Lighthouse's default (simulated) mobile run, without regressing CLS or desktop.

## Setup

- Production build (`pnpm build && pnpm start`) on localhost, image optimizer cache warmed before measuring
- Next.js 16.4.6, React 19
- Lighthouse 13.6.0 CLI, headless Chromium 156, performance category only
- Mobile: default preset (emulated Moto G Power, slow 4G)
- Desktop: `--preset=desktop`
- Simulated runs: 3 runs, median by LCP
- Devtools runs: `--throttling-method=devtools`, so the LCP breakdown and the LCP value come from the same trace

## Baseline

Commit: `d4be8d4`

| Run | Score | LCP | CLS | FCP | TBT |
|---|---|---|---|---|---|
| Mobile, simulated (median of 3) | 91 | 3.5 s | 0 | 0.8 s | 10 ms |
| Mobile, devtools throttling | | 1.7 s | | | |
| Desktop | 100 | 0.6 s | 0 | 0.2 s | 0 ms |

Simulated mobile LCP across the 3 runs: 3.5 s, 3.1 s, 3.5 s.

LCP element: the first card's thumbnail (`img.object-cover`, served through `next/image` at `w=750`).

### Image requests (mobile, devtools throttling)

| Start | End | Priority | Size | Image |
|---|---|---|---|---|
| 609 ms | 1713 ms | High | 35 KiB | Card 1 (LCP) |
| 609 ms | 1831 ms | High | 8 KiB | Card 2 |
| 609 ms | 2126 ms | High | 38 KiB | Card 3 |
| 610 ms | 2055 ms | High | 12 KiB | Card 4 |
| 2340 ms+ | | Low | | Cards 5+ (lazy) |

## Findings

- Desktop already meets the target (0.6 s), so the problem is mobile only.
- The first 4 cards all get `loading="eager"` and `fetchPriority="high"`. On mobile (1 column) only the first card is in the viewport, but all 4 images start downloading together at about 609 ms and split the slow 4G bandwidth.
- The LCP image is 35 KiB but takes 1104 ms to download, far more than it would need alone on that connection.
- Lazy images start after 2340 ms, so they do not compete with the LCP image.
- Under devtools throttling the LCP image is painted almost as soon as it finishes downloading, so render delay is not the bottleneck.
- The simulated LCP (3.5 s) and the devtools LCP (1.7 s) differ because the simulated run replays an unthrottled trace through a network model. The LCP breakdown in a simulated report comes from the unthrottled trace and does not add up to the reported LCP.

## Fixes

### A. High fetch priority only for the first card

Commit: `5c6b041`

The first 4 cards keep `loading="eager"`, but only the first gets `fetchPriority="high"`. A test asserts that only the first image is high priority.

| Run | Score | LCP | CLS | FCP | TBT |
|---|---|---|---|---|---|
| Mobile, simulated (median of 3) | 94 | 3.1 s | 0 | 0.8 s | 0 ms |
| Mobile, devtools throttling | 99 | 1.8 s | 0 | 1.5 s | 0 ms |

Simulated mobile LCP across the 3 runs: 3.1 s, 3.1 s, 3.1 s.

- Simulated LCP improved from 3.5 s to 3.1 s and became stable across runs.
- Devtools LCP did not move (1.7 s to 1.8 s, within noise). Cards 2 to 4 now start at 1276 to 1435 ms instead of 609 ms, but the LCP image still takes about 1.1 s while sharing the connection with fonts (52 KiB) and scripts (186 KiB).
- React 19 emits `<link rel="preload" as="image">` for every non-lazy image, so cards 2 to 4 are still preloaded, at auto priority.
- In the unthrottled trace the LCP image finishes at 133 ms but is painted at 394 ms, and the lazy images start at about 365 ms. Hypothesis: the grid's streamed Suspense boundary is revealed late, and the simulator counts every request started before that point (186 KiB JS, 52 KiB fonts, 232 KiB images).

## Results

_Pending._