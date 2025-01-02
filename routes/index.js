// routes/index.js
import express from 'express';
import AppController from '../controllers/AppController';
import UsersController from '../controllers/UsersController';
import AuthController from '../controllers/AuthController';
import FilesController from '../controllers/FilesController';

function routing(app) {
  const router = express.Router();
  app.use('/', router);

  // App Controller

  // Should return if Redis and DB are alive
  router.get('/status', (req, res) => {
    AppController.getStatus(req, res);
  });

  // Should return the number of users and files in the DB
  router.get('/stats', (req, res) => {
    AppController.getStats(req, res);
  });

  // User Controller

  // Should create a new user in DB
  router.post('/users', (req, res) => {
    UsersController.create(req, res);
  });

  // Should retrieve the user based on the token used
  router.get('/users/me', (req, res) => {
    UsersController.getCurrentUser(req, res);
  });

  // Auth Controller

  // Should sign-in the user by generating a new authentication token
  router.get('/connect', (req, res) => {
    AuthController.signIn(req, res);
  });

  // Should sign-out the user based on the token
  router.get('/disconnect', (req, res) => {
    AuthController.signOut(req, res);
  });

  // Files Controller

  // Should upload a new file to DB and disk
  router.post('/files', (req, res) => {
    FilesController.upload(req, res);
  });

  // Should retrieve a file by ID
  router.get('/files/:id', (req, res) => {
    FilesController.getFileById(req, res);
  });

  // Should retrieve all user file documents for a specific parentId and with pagination
  router.get('/files', (req, res) => {
    FilesController.getFiles(req, res);
  });

  // Should publish a file by ID
  router.put('/files/:id/publish', (req, res) => {
    FilesController.publishFile(req, res);
  });

  // Should unpublish a file by ID
  router.put('/files/:id/unpublish', (req, res) => {
    FilesController.unpublishFile(req, res);
  });

  // Should return the content of a file by ID
  router.get('/files/:id/data', (req, res) => {
    FilesController.getFileContent(req, res);
  });
}

export default routing;
