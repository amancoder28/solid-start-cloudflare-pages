import manifest from "../../dist/rmanifest.json";
import assetManifest from "../../dist/manifest.json";
import prepareManifest from "solid-start/runtime/prepareManifest";
import entry from "./app";

prepareManifest(manifest, assetManifest);

export const onRequestGet = ({ request, next }) => {
  const url = new URL(request.url);
  const pathname = url.pathname;

  // Handle static assets
  if (!pathname.match(`\/_m\/[^\/]+(\/)?$`) && /\.\w+$/.test(request.url)) {
    return next(request);
  }

  return entry({
    request,
    responseHeaders: new Headers(),
    manifest
  });
};
