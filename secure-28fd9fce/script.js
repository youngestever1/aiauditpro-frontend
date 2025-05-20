async function handleUpload() {
  const status = document.getElementById("status");
  const fileInput = document.getElementById("fileInput");
  const file = fileInput.files[0];

  if (!file) {
    status.textContent = "⚠️ Please select a file before uploading.";
    return;
  }

  status.textContent = "📤 Uploading file...";

  try {
    const formData = new FormData();
    formData.append("file", file);

    const response = await fetch("https://aiauditpro.onrender.com/upload", {
      method: "POST",
      body: formData
    });

    if (!response.ok) {
      const err = await response.text();
      throw new Error("Upload failed: " + err);
    }

    const data = await response.json();
    const downloadUrl = `https://aiauditpro.onrender.com${data.downloadUrl}`;

    status.textContent = "✅ Report ready. Opening download in new tab...";
    window.open(downloadUrl, "_blank");

  } catch (err) {
    console.error("❌ Upload error:", err);
    status.textContent = "❌ Error: " + err.message;
  }
}
