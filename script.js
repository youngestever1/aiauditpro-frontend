let userToken = "";

async function fetchTokenFromWix() {
  const status = document.getElementById("status");
  status.textContent = "🔐 Authenticating...";

  try {
    const response = await fetch("https://aiauditexpert.com/_functions/getSecureAccessToken", {
      credentials: "include"
    });

    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      throw new Error(err.error || "Failed to authenticate with Wix.");
    }

    const data = await response.json();
    userToken = data.token;
    console.log("✅ Token received from Wix:", userToken);
    status.textContent = "✅ Authenticated. You may now upload your file.";
  } catch (err) {
    console.error("❌ Token error:", err);
    status.textContent = "❌ Access denied: " + err.message;
  }
}

async function handleUpload() {
  const fileInput = document.getElementById("fileInput");
  const status = document.getElementById("status");

  if (!userToken) {
    status.textContent = "❌ You must be logged in and subscribed to use this tool.";
    return;
  }

  if (fileInput.files.length === 0) {
    status.textContent = "❌ Please select an Excel (.xlsx) file first.";
    return;
  }

  const file = fileInput.files[0];
  const formData = new FormData();
  formData.append("file", file);

  status.textContent = "⏳ Uploading and analyzing your file...";

  try {
    const response = await fetch("https://aiauditpro.onrender.com/upload", {
      method: "POST",
      headers: {
        "x-auth-token": userToken
      },
      body: formData
    });

    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      throw new Error(err.error || "Server returned an error.");
    }

    const blob = await response.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "AiAuditExpert_Report.pdf";
    a.click();

    status.textContent = "✅ Your audit report has been downloaded.";
  } catch (err) {
    console.error("❌ Upload error:", err);
    status.textContent = "❌ " + err.message;
  }
}

window.onload = fetchTokenFromWix;
