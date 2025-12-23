---
title: 文档查看器
icon: fas fa-file-alt
order: 1000
---

<div class="data-visualization-report">
  <h1>数据可视化报告</h1>
  
  <p>以下是在线查看的数据可视化报告：</p>
  
  <div id="loading-indicator" style="display: flex; justify-content: center; align-items: center; height: 200px;">
    <div class="spinner" style="border: 4px solid #f3f3f3; border-top: 4px solid #3498db; border-radius: 50%; width: 40px; height: 40px; animation: spin 2s linear infinite;"></div>
    <span style="margin-left: 15px;">正在加载文档，请稍候...</span>
  </div>
  
  <div id="docx-container" style="display: none; margin-top: 20px;"></div>
  
  <div id="error-message" style="display: none; color: red; margin-top: 20px;"></div>
  
  <p style="margin-top: 20px;">如果文档无法显示，您可以<a href="{{ '/assets/files/数据可视化.docx' | relative_url }}" target="_blank">点击此处下载文档</a>。</p>
</div>

<style>
  .data-visualization-report {
    max-width: 1200px;
    margin: 0 auto;
    padding: 20px;
  }
  
  #docx-container {
    border: 1px solid #ccc;
    border-radius: 8px;
    padding: 20px;
    min-height: 600px;
    background-color: white;
  }
  
  .docx-content {
    line-height: 1.6;
  }
  
  .docx-content h1, .docx-content h2, .docx-content h3 {
    color: #2c3e50;
  }
  
  .docx-content p {
    margin-bottom: 1em;
  }
  
  .docx-content table {
    width: 100%;
    border-collapse: collapse;
    margin: 1em 0;
  }
  
  .docx-content table, .docx-content th, .docx-content td {
    border: 1px solid #ddd;
  }
  
  .docx-content th, .docx-content td {
    padding: 8px;
    text-align: left;
  }
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
</style>

<script src="https://cdn.jsdelivr.net/npm/mammoth@1.4.2/mammoth.browser.min.js"></script>
<script>
document.addEventListener("DOMContentLoaded", function() {
  // 获取文档容器和加载指示器
  const loadingIndicator = document.getElementById("loading-indicator");
  const docxContainer = document.getElementById("docx-container");
  const errorMessage = document.getElementById("error-message");
  
  // 设置超时时间
  const timeout = setTimeout(() => {
    loadingIndicator.innerHTML = '<p>文档加载时间较长，请耐心等待或尝试刷新页面...</p>';
  }, 10000); // 10秒后显示等待消息
  
  // 加载并转换.docx文件
  fetch("{{ '/assets/files/数据可视化.docx' | relative_url }}")
    .then(function(response) {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.arrayBuffer();
    })
    .then(function(arrayBuffer) {
      return mammoth.convertToHtml({arrayBuffer: arrayBuffer});
    })
    .then(function(result) {
      clearTimeout(timeout); // 清除超时计时器
      loadingIndicator.style.display = "none";
      docxContainer.style.display = "block";
      docxContainer.innerHTML = '<div class="docx-content">' + result.value + '</div>';
      
      // 应用任何警告信息
      var messages = result.messages;
      console.log(messages);
    })
    .catch(function(error) {
      clearTimeout(timeout); // 清除超时计时器
      console.error("文档加载失败:", error);
      loadingIndicator.style.display = "none";
      errorMessage.style.display = "block";
      errorMessage.innerHTML = `
        <p>文档加载失败: ${error.message}</p>
        <p>请尝试<a href="{{ '/assets/files/数据可视化.docx' | relative_url }}" target="_blank">下载文档</a>进行查看。</p>
      `;
    });
});
</script>