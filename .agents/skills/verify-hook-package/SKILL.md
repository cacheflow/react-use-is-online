---
name: verify-hook-package
description: Verify react-use-is-online package entry points, generated JavaScript and declarations, and npm package contents. Use for packaging changes or release-readiness checks; does not authorize publishing.
---

# Verify the hook package

Read `package.json`, `tsconfig.json`, `.npmignore`, and the current source exports. Inspect the publishing workflow when the task involves release automation.

The current package uses CommonJS with an ES5 TypeScript target. `main` and `typings` point to `lib/index.js` and `lib/index.d.ts`. Its file allowlist also includes `lib/getConnection.js` and `lib/getConnection.d.ts`; inspect helper exports and deep-import compatibility before removing them.

For code or packaging changes:

1. Run `npm test -- --runInBand` and `npm run build` with installed project dependencies. `prepublishOnly` runs tests and build, but invoking a build alone does not run tests.
2. Inspect the `lib/` diff. The current compiler also emits test files; do not confuse committed build output with the published file list or hand-edit generated files to fix source issues.
3. Run `npm pack --dry-run --ignore-scripts` to inspect package contents without publishing or rerunning lifecycle scripts. Confirm runtime helpers and declarations are included and tests or agent instructions are not unexpectedly included.
4. Check that runtime exports, declarations, and README examples agree. Report any untested peer-version compatibility instead of inferring it from the React 18 test environment.

Do not change versions, create release tags, or publish unless requested. Report concrete failures and remaining uncertainties; do not expand a packaging check into a tooling migration.
