async function fetchTokenFromWix() {
  const status = document.getElementById("status");
  status.textContent = "🔐 Authenticating...";

  try {
    const response = await fetch("https://aiauditexpert.com/_functions/getSecureAccessToken", {
      credentials: "include"
    });

    console.log("🔍 Raw response from Wix token endpoint:", response);

    if (!response.ok) {
      const err = await response.text();
      console.error("❌ Failed response:", err);
      throw new Error("Authentication failed: " + err);
    }

    const data = await response.json();
    userToken = data.token;
    console.log("✅ Token received from Wix:", userToken);
    status.textContent = "✅ Authenticated. You may now upload your file.";

    // You can now continue to process the file or send it to your backend
    const fileInput = document.getElementById("fileInput");
    const file = fileInput.files[0];

    if (!file) {
      status.textContent = "⚠️ Please select a file before uploading.";
      return;
    }

    // Upload the file to your backend
    status.textContent = "📤 Uploading file...";
    const formData = new FormData();
    formData.append("file", file);
    formData.append("token", userToken);

    const uploadResponse = await fetch("https://aiauditpro-backend.onrender.com/upload", {
      method: "POST",
      body: formData
    });

    if (!uploadResponse.ok) {
      const err = await uploadResponse.text();
      throw new Error("Upload failed: " + err);
    }

    status.textContent = "✅ Report is being generated. Check your email or download soon!";
  } catch (err) {
    console.error("❌ Upload error:", err);
    const status = document.getElementById("status");
    status.textContent = "❌ Error: " + err.message;
  }
}

// Define this function so the button works
function handleUpload() {
  fetchTokenFromWix();
}
