import sha1 from 'sha1';
import dbClient from '../utils/db';

class UsersController {
  static async postNew(req, res) {
    const { email, password } = req.body;

    // 1. التحقق من وجود البريد الإلكتروني
    if (!email) {
      return res.status(400).json({ error: 'Missing email' });
    }

    // 2. التحقق من وجود كلمة المرور
    if (!password) {
      return res.status(400).json({ error: 'Missing password' });
    }

    // 3. التحقق من اتصال قاعدة البيانات
    if (!dbClient.isAlive()) {
      return res.status(500).json({ error: 'Database not connected' });
    }

    // 4. الوصول إلى مجموعة users
    const usersCollection = dbClient.client.db(dbClient.dbName).collection('users');

    // 5. التحقق من وجود المستخدم
    const user = await usersCollection.findOne({ email });
    if (user) {
      return res.status(400).json({ error: 'Already exist' });
    }

    // 6. تشفير كلمة المرور
    const hashedPassword = sha1(password);

    // 7. إنشاء مستخدم جديد
    const newUser = {
      email,
      password: hashedPassword,
    };

    // 8. إدراج المستخدم في قاعدة البيانات
    const result = await usersCollection.insertOne(newUser);

    // 9. إرجاع البيانات
    const userId = result.insertedId.toString();
    return res.status(201).json({ id: userId, email });
  }
}

export default UsersController;
