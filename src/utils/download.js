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

export function importJSON() {
  return new Promise((resolve) => {
    const input = document.createElement("input");
    input.type = "file";
    input.id = "file-json";
    input.style.display = "none";
    document.body.appendChild(input);
    input.addEventListener("change", (e) => {
      let json = document.getElementById("file-json").files[0];
      const reader = new FileReader();
      reader.readAsText(json, "UTF-8");
      reader.onload = function (evt) {
        const data = JSON.parse(evt.target.result);
        resolve(data);
        // 清理
        setTimeout(() => {
          document.body.removeChild(input);
        }, 0);
      };
    });
    input.click();
  });
}
