import { expect } from 'chai';
import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../server'; // استيراد تطبيق Express

chai.use(chaiHttp);

describe('Endpoints', () => {
  // اختبار GET /status
  it('should return Redis and DB status', async () => {
    const res = await chai.request(app).get('/status');
    expect(res.status).to.equal(200);
    expect(res.body).to.have.property('redis');
    expect(res.body).to.have.property('db');
  });

  // اختبار GET /stats
  it('should return the number of users and files', async () => {
    const res = await chai.request(app).get('/stats');
    expect(res.status).to.equal(200);
    expect(res.body).to.have.property('users');
    expect(res.body).to.have.property('files');
  });

  // اختبار POST /users
  it('should create a new user', async () => {
    const res = await chai.request(app)
      .post('/users')
      .send({ email: 'test@example.com', password: 'password123' });
    expect(res.status).to.equal(201);
    expect(res.body).to.have.property('id');
    expect(res.body).to.have.property('email', 'test@example.com');
  });

  // اختبار GET /connect
  it('should authenticate a user', async () => {
    const res = await chai.request(app)
      .get('/connect')
      .set('Authorization', 'Basic ' + Buffer.from('test@example.com:password123').toString('base64'));
    expect(res.status).to.equal(200);
    expect(res.body).to.have.property('token');
  });

  // اختبار GET /disconnect
  it('should disconnect a user', async () => {
    const token = 'valid-token'; // استبدل بقيمة صالحة
    const res = await chai.request(app)
      .get('/disconnect')
      .set('X-Token', token);
    expect(res.status).to.equal(204);
  });

  // اختبار GET /users/me
  it('should return the authenticated user', async () => {
    const token = 'valid-token'; // استبدل بقيمة صالحة
    const res = await chai.request(app)
      .get('/users/me')
      .set('X-Token', token);
    expect(res.status).to.equal(200);
    expect(res.body).to.have.property('id');
    expect(res.body).to.have.property('email');
  });

  // اختبار POST /files
  it('should upload a new file', async () => {
    const token = 'valid-token'; // استبدل بقيمة صالحة
    const res = await chai.request(app)
      .post('/files')
      .set('X-Token', token)
      .send({
        name: 'test.txt',
        type: 'file',
        data: Buffer.from('Hello, World!').toString('base64'),
      });
    expect(res.status).to.equal(201);
    expect(res.body).to.have.property('id');
  });

  // اختبار GET /files/:id
  it('should retrieve a file by ID', async () => {
    const token = 'valid-token'; // استبدل بقيمة صالحة
    const fileId = 'valid-file-id'; // استبدل بقيمة صالحة
    const res = await chai.request(app)
      .get(`/files/${fileId}`)
      .set('X-Token', token);
    expect(res.status).to.equal(200);
    expect(res.body).to.have.property('id', fileId);
  });

  // اختبار PUT /files/:id/publish
  it('should publish a file', async () => {
    const token = 'valid-token'; // استبدل بقيمة صالحة
    const fileId = 'valid-file-id'; // استبدل بقيمة صالحة
    const res = await chai.request(app)
      .put(`/files/${fileId}/publish`)
      .set('X-Token', token);
    expect(res.status).to.equal(200);
    expect(res.body).to.have.property('isPublic', true);
  });

  // اختبار PUT /files/:id/unpublish
  it('should unpublish a file', async () => {
    const token = 'valid-token'; // استبدل بقيمة صالحة
    const fileId = 'valid-file-id'; // استبدل بقيمة صالحة
    const res = await chai.request(app)
      .put(`/files/${fileId}/unpublish`)
      .set('X-Token', token);
    expect(res.status).to.equal(200);
    expect(res.body).to.have.property('isPublic', false);
  });

  // اختبار GET /files/:id/data
  it('should retrieve file data', async () => {
    const fileId = 'valid-file-id'; // استبدل بقيمة صالحة
    const res = await chai.request(app)
      .get(`/files/${fileId}/data`);
    expect(res.status).to.equal(200);
    expect(res.text).to.equal('Hello, World!');
  });
});
