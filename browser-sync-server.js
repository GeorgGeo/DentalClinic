import browserSync from 'browser-sync';

const browserSyncInstance = browserSync.create();

browserSyncInstance.init({
  server: {
    baseDir: 'app/',
  },
  port: 3000,
});
