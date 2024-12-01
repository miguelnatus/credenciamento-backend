import express from 'express';
import path from 'path';

export const serveStaticFiles = (app) => {
  app.use('/images', express.static(path.join(process.cwd(), 'images')));
};