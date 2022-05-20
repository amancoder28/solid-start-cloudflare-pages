import manifest from "../../dist/rmanifest.json";
import assetManifest from "../../dist/manifest.json";
import prepareManifest from "solid-start/runtime/prepareManifest";
import entry from "./app";

prepareManifest(manifest, assetManifest);

export const onRequestGet = async ({ request, next, waitUntil }) => {
  // Handle static assets
  if (/\.\w+$/.test(request.url)) {
    return next(request);
  }

  const url = new URL(request.url);
  const useCache = url.hostname !== "localhost";

  const cache = await caches.open("custom:solid");

  // Early return from cache
  if (useCache) {
    const cachedResponse = await cache.match(request);

    if (cachedResponse) {
      return cachedResponse;
    }
  }

  const response = await entry({
    request,
    responseHeaders: new Headers(),
    manifest,
  });

  if (useCache) {
    // waitUntil the Cache is set
    waitUntil(cache.put(request, response));
  }

  // Return Solid SSR response
  // I don't know why, but the response can't be returned if there is waitUntil above it
  // Note that the Caching Works, but after the Cache is set, the response will be Empty
  return response;
};

export const onRequestHead = async ({ request, next }) => {
  // Handle static assets
  if (/\.\w+$/.test(request.url)) {
    return next(request);
  }

  return entry({
    request,
    responseHeaders: new Headers(),
    manifest,
  });
};

export async function onRequestPost({ request }) {
  // Allow for POST /_m/33fbce88a9 server function
  return entry({
    request,
    responseHeaders: new Headers(),
    manifest,
  });
}
