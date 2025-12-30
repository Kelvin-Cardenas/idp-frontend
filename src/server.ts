
import { APP_BASE_HREF } from '@angular/common';
import { CommonEngine, isMainModule } from '@angular/ssr/node';
import express from 'express';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import bootstrap from './main.server';

const serverDistFolder = dirname(fileURLToPath(import.meta.url));
const browserDistFolder = resolve(serverDistFolder, '../browser');
const indexServerHtml = join(serverDistFolder, 'index.server.html');

const app = express();
const commonEngine = new CommonEngine();

// Evita 304
app.disable('etag');

// No cache para HTML
app.use((req, res, next) => {
  const accept = req.headers.accept || '';
  if (typeof accept === 'string' && accept.includes('text/html')) {
    res.setHeader('Cache-Control', 'no-store');
  }
  next();
});

// Estáticos con cache largo (si tienes hashing en nombres, immutable ayuda)
app.use(express.static(browserDistFolder, {
  maxAge: '1y',
  immutable: true,
  index: false,
  redirect: false,
}));



app.get('*', (req, res, next) => {
  const { originalUrl, baseUrl, headers } = req;
  const proto = (req.headers['x-forwarded-proto'] as string) || req.protocol;

  commonEngine.render({
    bootstrap,
    documentFilePath: indexServerHtml,
    url: `${proto}://${headers.host}${originalUrl}`,
    publicPath: browserDistFolder,
    providers: [{ provide: APP_BASE_HREF, useValue: baseUrl }],
  })
  .then(html => res.send(html))
  .catch(next);
});



if (isMainModule(import.meta.url)) {
  const port = process.env['PORT'] || 8080;
  app.listen(port, () => console.log(`SSR listening on :${port}`));
}

export default app;