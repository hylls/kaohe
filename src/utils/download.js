export function downloadJSON(data, filename = "data.json") {
    // 将数据转换为JSON字符串
    const jsonStr = JSON.stringify(data, null, 2);
  
    // 创建Blob对象
    const blob = new Blob([jsonStr], { type: "application/json" });
  
    // 创建下载链接
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
  
    // 触发点击下载
    document.body.appendChild(a);
    a.click();
  
    // 清理
    setTimeout(() => {
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }, 0);
  }
  