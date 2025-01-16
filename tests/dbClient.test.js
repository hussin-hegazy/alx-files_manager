import { expect } from 'chai';
import dbClient from '../utils/db';

describe('DBClient', () => {
  // اختبار اتصال MongoDB
  it('should check if MongoDB connection is alive', () => {
    expect(dbClient.isAlive()).to.be.true;
  });

  // اختبار عدد المستخدمين
  it('should return the number of users', async () => {
    const usersCount = await dbClient.nbUsers();
    expect(usersCount).to.be.a('number');
  });

  // اختبار عدد الملفات
  it('should return the number of files', async () => {
    const filesCount = await dbClient.nbFiles();
    expect(filesCount).to.be.a('number');
  });
});
