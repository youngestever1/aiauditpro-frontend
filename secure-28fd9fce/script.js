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

    // Clear status area
    status.innerHTML = "✅ Report ready. ";

    // Create the clickable link
    const link = document.createElement("a");
    link.href = downloadUrl; // set real URL
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    link.textContent = "📄 Click here to download your report";
    link.style.display = "inline-block";
    link.style.marginTop = "1rem";
    link.style.color = "#0050ff";
    link.style.fontWeight = "bold";

    // Force window.open in handler — some browsers require this
    link.addEventListener("click", (e) => {
      e.preventDefault();
      window.open(downloadUrl, "_blank");
    });

    status.appendChild(link);

  } catch (err) {
    console.error("❌ Upload error:", err);
    status.textContent = "❌ Error: " + err.message;
  }
}
