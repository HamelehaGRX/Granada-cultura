const CACHE_PREFIX = "cultura-" + self.registration.scope + "-";
const CACHE = CACHE_PREFIX + "v0.1.1";
const ASSETS = [
  "./",
  "./index.html",
  "./styles.css",
  "./app.js",
  "./manifest.webmanifest",
  "./data/eventos.json",
  "./data/categorias.json",
  "./assets/icons/icon-192.png",
  "./assets/icons/icon-512.png",
  "./assets/images/categorias/musica/rock.svg",
  "./assets/images/categorias/exposiciones/pintura.svg",
  "./assets/images/categorias/literatura/poesia.svg",
  "./assets/images/categorias/cine/cine-independiente.svg",
  "./assets/images/categorias/teatro/drama.svg",
  "./assets/images/categorias/musica/jazz.svg",
  "./assets/images/categorias/infantil/magia.svg",
  "./assets/images/categorias/comedia/monologos.svg",
  "./assets/images/categorias/gastronomia/catas.svg",
  "./assets/images/categorias/danza/contemporanea.svg",
  "./assets/images/categorias/patrimonio/visitas-guiadas.svg",
  "./assets/images/categorias/ferias/mercado-medieval.svg",
  "./assets/images/categorias/exposiciones/fotografia.svg",
  "./assets/images/categorias/musica/flamenco.svg",
  "./assets/images/categorias/generica.svg"
];

self.addEventListener("install", event => {
  event.waitUntil(caches.open(CACHE).then(cache => cache.addAll(ASSETS)).then(() => self.skipWaiting()));
});

self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(keys => Promise.all(keys.filter(key => key.startsWith(CACHE_PREFIX) && key !== CACHE).map(key => caches.delete(key))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", event => {
  if (event.request.method !== "GET" || !event.request.url.startsWith(self.registration.scope)) return;
  event.respondWith((async () => {
    const cache = await caches.open(CACHE);
    try {
      const response = await fetch(event.request);
      if (response.ok) await cache.put(event.request, response.clone());
      return response;
    } catch {
      const cached = await cache.match(event.request);
      if (cached) return cached;
      if (event.request.mode === "navigate") return (await cache.match("./index.html")) || Response.error();
      return Response.error();
    }
  })());
});
