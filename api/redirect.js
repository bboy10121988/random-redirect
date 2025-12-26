import { kv } from '@vercel/kv';

export default async function handler(request, response) {
  // 強制不快取 API 回傳結果
  response.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
  response.setHeader('Pragma', 'no-cache');
  response.setHeader('Expires', '0');

  const urls = [
    "https://wa.me/message/JXF4METTM5LVG1",
    "https://wa.me/message/YAYM5IU57KQLN1",
    "https://wa.me/message/PECGZA6JZYQEL1"
  ];

  try {
    // 進行原子加法
    const newCount = await kv.incr('url_index');

    // 計算索引
    const currentIndex = (newCount - 1) % urls.length;
    const targetUrl = urls[currentIndex];

    return response.status(200).json({ url: targetUrl });
  } catch (error) {
    // 萬一失敗，才使用隨機分配
    const randomUrl = urls[Math.floor(Math.random() * urls.length)];
    return response.status(200).json({
      url: randomUrl,
      debug: "KV_FAILED",
      error: error.message
    });
  }
}
