---
name: maintain-online-hook
description: Maintain react-use-is-online connectivity behavior, effect subscriptions, network estimates, and SSR safety. Use when changing the hook or its connection helpers and behavioral tests.
---

# Maintain the online hook

Read `src/index.ts`, `src/getConnection.ts`, and the tests relevant to the requested change. Paths are relative to the repository root.

Preserve these existing contracts unless the task deliberately changes them:

- `isOnline` follows `navigator.onLine`; a failed estimate must not override it.
- Subscribe to window `online`/`offline` events synchronously and refresh status after subscribing. A pending fallback fetch must not delay subscriptions.
- Subscribe to `change` on the native or prefixed connection object itself. Remove listeners from the same objects using the same callbacks.
- Ignore asynchronous connection results after effect cleanup. For concurrency changes, consider stale responses and effect replay as well as unmounting.
- Native connection properties can be absent. Preserve unknown values rather than inventing measurements.
- Without native information, retain the request-timing fallback and `getConnectionEstimate` helper. Its direct failure representation differs from the normalized hook connection object; inspect both before modifying either.
- On the server, the hook returns both booleans false, connection null, and a browser-environment error. Avoid browser globals during import/render; SSR safety alone does not establish hydration equivalence.

Use the existing React Testing Library `renderHook` pattern. Mock fetch and timing so tests never depend on external connectivity. Test the behavior affected by the change: immediate transitions while a probe is pending, prefixed APIs, partial properties, failed probes, listener cleanup, or Node SSR as appropriate. Restore globals and spies.

Keep the declared React peer range in mind; passing React 18 tests does not prove compatibility with all supported React versions. Run the test suite and build for source changes, and inspect generated output.
