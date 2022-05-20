# start-cloudflare-pages

Adapter for Solid apps that work on Cloudflare Pages Functions.

This is very experimental; the adapter API isn't at all fleshed out, and things
will definitely change.


Usage
Add the adapter in your vite.config.js file

import solid from "solid-start";
import pages from "solid-start-cloudflare-pages";

export default defineConfig({
  plugins: [
    solid({ adapter: pages() })
  ]
});

More info on configuring a cloudflare Pages Functions can be found
[here](https://developers.cloudflare.com/pages/platform/functions/).
