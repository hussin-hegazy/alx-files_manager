import { ObjectId } from 'mongodb';
import fs from 'fs';
import path from 'path';
import imageThumbnail from 'image-thumbnail';
import dbClient from './utils/db';
import fileQueue from './utils/queue/fileQueue'; // قائمة انتظار الملفات
import userQueue from './utils/queue/userQueue'; // قائمة انتظار المستخدمين

// معالجة المهام في قائمة انتظار الملفات (إنشاء الثيمبنيلات)
fileQueue.process(async (job) => {
  const { userId, fileId } = job.data;

  // التحقق من وجود fileId و userId
  if (!fileId) {
    throw new Error('Missing fileId');
  }
  if (!userId) {
    throw new Error('Missing userId');
  }

  // البحث عن الملف في قاعدة البيانات
  const file = await dbClient.db.collection('files').findOne({
    _id: ObjectId(fileId),
    userId: ObjectId(userId),
  });

  if (!file) {
    throw new Error('File not found');
  }

  // إنشاء الثيمبنيلات إذا كان الملف صورة
  if (file.type === 'image') {
    const sizes = [500, 250, 100]; // الأحجام المطلوبة للثيمبنيلات
    const filePath = file.localPath;

    for (const size of sizes) {
      try {
        const thumbnail = await imageThumbnail(filePath, { width: size });
        const thumbnailPath = `${filePath}_${size}`;
        fs.writeFileSync(thumbnailPath, thumbnail);
      } catch (err) {
        console.error(`Error generating thumbnail for size ${size}:`, err);
      }
    }
  }
});

// معالجة المهام في قائمة انتظار المستخدمين (إرسال البريد الترحيبي)
userQueue.process(async (job) => {
  const { userId } = job.data;

  // التحقق من وجود userId
  if (!userId) {
    throw new Error('Missing userId');
  }

  // البحث عن المستخدم في قاعدة البيانات
  const user = await dbClient.db.collection('users').findOne({
    _id: ObjectId(userId),
  });

  if (!user) {
    throw new Error('User not found');
  }

  // إرسال البريد الترحيبي (في هذه الحالة، طباعة رسالة في الكونسول)
  console.log(`Welcome ${user.email}!`);

  // في الواقع، يمكنك استخدام خدمة مثل Mailgun لإرسال بريد إلكتروني حقيقي
});

// بدء تشغيل العامل (Worker)
console.log('Worker started and waiting for jobs...');
