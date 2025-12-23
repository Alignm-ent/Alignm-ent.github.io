---
title: 文档查看器
icon: fas fa-file-alt
order: 1000
---

<div class="data-visualization-report">
  <h1>数据可视化报告</h1>
  
  <p>以下是在线查看的数据可视化报告：</p>
  
  <div id="docx-container">
    <p>正在加载文档...</p>
  </div>
  
  <p>如果文档无法显示，您可以<a href="{{ '/assets/files/数据可视化.docx' | relative_url }}" target="_blank">点击此处下载文档</a>。</p>
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
</style>

<script src="https://cdn.jsdelivr.net/npm/mammoth@1.4.2/mammoth.browser.min.js"></script>
<script>
document.addEventListener("DOMContentLoaded", function() {
  // 加载并转换.docx文件
  fetch("{{ '/assets/files/数据可视化.docx' | relative_url }}")
    .then(function(response) {
      return response.arrayBuffer();
    })
    .then(function(arrayBuffer) {
      return mammoth.convertToHtml({arrayBuffer: arrayBuffer});
    })
    .then(function(result) {
      document.getElementById("docx-container").innerHTML = '<div class="docx-content">' + result.value + '</div>';
      
      // 应用任何警告信息
      var messages = result.messages;
      console.log(messages);
    })
    .catch(function(error) {
      console.error("文档加载失败:", error);
      document.getElementById("docx-container").innerHTML = 
        '<p style="color: red;">文档加载失败，请尝试下载后查看：<a href="{{ \'/assets/files/数据可视化.docx\' | relative_url }}" target="_blank">点击下载</a></p>';
    });
});
</script>