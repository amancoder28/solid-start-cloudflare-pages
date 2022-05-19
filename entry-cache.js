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

  // Early return from cache
  const cache = await caches.open("custom:solid");

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
    waitUntil(cache.put(request, response));

    // console.log(cache, response);
  }

  // Return Solid SSR response
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
