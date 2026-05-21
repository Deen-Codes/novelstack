// OpenNext Cloudflare adapter config. Minimal setup — the defaults give
// SSR, server actions, middleware and the Image component on Cloudflare
// Workers with the Node.js runtime. Caching can be layered in later.
import { defineCloudflareConfig } from '@opennextjs/cloudflare';

export default defineCloudflareConfig();
