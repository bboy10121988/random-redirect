function doGet() {
  // 1. 設定您的網址清單
  var urls = [
    "https://wa.me/message/JXF4METTM5LVG1",
    "https://wa.me/message/YAYM5IU57KQLN1",
    "https://wa.me/message/PECGZA6JZYQEL1"
  ];

  // 2. 獲取腳本屬性 (這是一個簡單的資料庫，用來儲存目前的計數)
  var scriptProperties = PropertiesService.getScriptProperties();
  
  // 3. 讀取目前的 index，如果沒有則預設為 0
  var currentIndex = parseInt(scriptProperties.getProperty('URL_INDEX'));
  if (isNaN(currentIndex)) {
    currentIndex = 0;
  }

  // 4. 取得這次要跳轉的網址
  var targetUrl = urls[currentIndex];

  // 5. 計算下一次的 index (如果超過陣列長度就回到 0)
  var nextIndex = (currentIndex + 1) % urls.length;
  
  // 6. 儲存新的 index 供下一位使用者使用
  // 使用 LockService 防止多人同時點擊時數字重複
  var lock = LockService.getScriptLock();
  try {
    lock.waitLock(10000); // 等待最多 10 秒
    scriptProperties.setProperty('URL_INDEX', nextIndex.toString());
  } catch (e) {
    // 如果鎖定失敗，也沒關係，只是順序可能稍微亂一次
    Logger.log('Could not obtain lock to update index.');
  } finally {
    lock.releaseLock();
  }

  // 7. 執行跳轉
  // 使用 HTML Meta Redirect + JavaScript 以確保跳轉成功
  // Google Apps Script 直接 return HtmlService 可以隱藏跳轉過程
  var html = '<!DOCTYPE html><html><head>' + 
             '<meta http-equiv="refresh" content="0;url=' + targetUrl + '">' +
             '<script>window.location.href="' + targetUrl + '";</script>' +
             '</head><body>Redirecting...</body></html>';
             
  return HtmlService.createHtmlOutput(html)
    .addMetaTag('viewport', 'width=device-width, initial-scale=1')
    .setTitle('Redirecting...');
}
