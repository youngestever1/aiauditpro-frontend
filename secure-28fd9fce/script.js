async function handleUpload() {
  const status = document.getElementById("status");
  const fileInput = document.getElementById("fileInput");
  const emailInput = document.getElementById("emailInput");
  const file = fileInput.files[0];
  const email = emailInput.value.trim();

  if (!file) {
    status.textContent = "⚠️ Please select a file before uploading.";
    return;
  }

  if (!email || !email.includes("@")) {
    status.textContent = "⚠️ Please enter a valid email address.";
    return;
  }

  status.textContent = "📤 Uploading file...";

  try {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("email", email);

    const response = await fetch("https://aiauditpro.onrender.com/upload", {
      method: "POST",
      body: formData
    });

    if (!response.ok) {
      const err = await response.text();
      throw new Error("Upload failed: " + err);
    }

    status.textContent = "✅ Report sent! Check your email.";
  } catch (err) {
    console.error("❌ Upload error:", err);
    status.textContent = "❌ Error: " + err.message;
  }
}
