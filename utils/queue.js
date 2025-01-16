// utils/queue.js
import Bull from 'bull';

// إنشاء قائمة انتظار جديدة
const userQueue = new Bull('userQueue');

export default userQueue;
