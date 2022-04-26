import manifest from "../../dist/rmanifest.json";
import assetManifest from "../../dist/manifest.json";
import prepareManifest from "solid-start/runtime/prepareManifest";
import entryServer from "./app";

prepareManifest(manifest, assetManifest);

export const onRequestGet = ({ request, next }) => {
  if (/\.\w+$/.test(request.url)) {
    return next(request);
  }

  return entryServer({
    request,
    responseHeaders: new Headers(),
    manifest,
  });
};
