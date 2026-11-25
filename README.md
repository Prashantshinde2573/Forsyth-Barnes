# Forsyth Barnes homepage

A React homepage using the live brand identity and locally bundled imagery. The original logo SVG defines the primary purple, #8c4b9d.

## Run or build

Use Node.js 22 or newer.

```sh
npm ci
npm run dev
npm run build
npm run preview
```

The production output is in `dist/`.

## Integrate

- Mount the default export in `src/HomePage.jsx` at the homepage route and import `src/styles.css`. Styles are scoped under `.fb-home`. The included `main.jsx` is the standalone entry point.
- Serve `public/media/` as `media/` under the Vite base URL. For another build system, adapt the `media()` helper in `src/content.js` to use that system’s public asset path.
- Links intentionally resolve to the existing Forsyth Barnes site so the standalone build reaches real jobs, sector pages, sign-in and the contact flow. The Contact page handles enquiries. Reuse the host site's consent and analytics integration when mounting the homepage.
- The video carousel streams the existing site’s MP4s. It includes the eleven entries with an MP4 URL. The live UNILed item points to a directory, so it is omitted until a playable source is supplied.
- The project contains both the editable source and a prebuilt static bundle. No keys or backend configuration are needed to render it.

## Navigation and hero

The image-led dropdowns share one set of link data across desktop and mobile.
The hero streams the original Forsyth Barnes homepage MP4. Serve it from the
existing origin, or update `heroVideo` if your deployment moves the asset. If
autoplay is blocked, visitors can start playback with the hero control. Reduced
motion and media failures use the local photographic fallback.
