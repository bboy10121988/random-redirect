import { kv } from '@vercel/kv';

export default async function handler(request, response) {
  const urls = [
    "https://wa.me/message/JXF4METTM5LVG1",
    "https://wa.me/message/YAYM5IU57KQLN1",
    "https://wa.me/message/PECGZA6JZYQEL1"
  ];

  try {
    // 3. 更新計數 (原子操作) - 直接取回新的號碼，確保不會重複
    // INCR 會直接回傳加 1 後的結果 (1, 2, 3...)
    const newCount = await kv.incr('url_index');

    // 2. 決定這次的網址
    // newCount - 1 是為了讓第一次 (1) 對應到陣列索引 0
    const currentIndex = (newCount - 1) % urls.length;
    const targetUrl = urls[currentIndex];

    // 4. 回傳目標網址 (JSON 格式)
    return response.status(200).json({ url: targetUrl });
  } catch (error) {
    // 萬一資料庫連線失敗，退回隨機分配
    console.error(error);
    const randomUrl = urls[Math.floor(Math.random() * urls.length)];
    return response.status(200).json({ url: randomUrl });
  }
}
