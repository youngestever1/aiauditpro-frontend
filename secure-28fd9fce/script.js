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
  } catch (err) {
    console.error("❌ Token error:", err);
    status.textContent = "❌ Access denied: " + err.message;
  }
}
