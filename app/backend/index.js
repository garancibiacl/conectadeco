const { createApp } = require('./server');
const { env } = require('./config/env');

const app = createApp();

app.listen(env.port, () => {
  console.log(`ConectaDeco backend escuchando en http://${env.apiHost}:${env.port}`);
});
