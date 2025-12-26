import { kv } from '@vercel/kv';

export default async function handler(request, response) {
  const urls = [
    "https://wa.me/message/JXF4METTM5LVG1",
    "https://wa.me/message/YAYM5IU57KQLN1",
    "https://wa.me/message/PECGZA6JZYQEL1"
  ];

  try {
    // 1. 從 Redis (KV) 獲取目前的計數
    let currentIndex = await kv.get('url_index');
    if (currentIndex === null) {
        currentIndex = 0;
    } else {
        currentIndex = parseInt(currentIndex);
    }

    // 2. 決定這次的網址
    const targetUrl = urls[currentIndex % urls.length];

    // 3. 更新計數 (原子操作)
    // INCR 指令保證就算多人同時點擊，也會依序 +1，不會重複
    await kv.incr('url_index');

    // 4. 回傳目標網址 (JSON 格式)
    return response.status(200).json({ url: targetUrl });
  } catch (error) {
    // 萬一資料庫連線失敗，退回隨機分配
    console.error(error);
    const randomUrl = urls[Math.floor(Math.random() * urls.length)];
    return response.status(200).json({ url: randomUrl });
  }
}
