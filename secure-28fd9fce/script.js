// script.js – Vercel-hosted app logic

function getMemberEmail() {
  const params = new URLSearchParams(window.location.search);
  return params.get('m') || '';
}

async function handleUpload() {
  const statusElem = document.getElementById("status");
  const fileInput  = document.getElementById("fileInput");
  const file       = fileInput?.files?.[0];
  const email      = getMemberEmail();
  const button     = document.getElementById("uploadButton");

  // Sanity checks
  if (!file) {
    statusElem.textContent = "⚠️ Please select a file.";
    return;
  }

  if (!email) {
    statusElem.textContent = "⚠️ No member e-mail found. Please return to the main site.";
    console.error("Missing ?m= email in URL.");
    return;
  }

  // Disable button and grey it out
  button.disabled = true;
  button.style.backgroundColor = "#999";

  // Set uploading status
  statusElem.textContent = "📤 Uploading and analyzing your ledger...";

  try {
    const form = new FormData();
    form.append("file", file);
    form.append("email", email);

    const response = await fetch("https://aiauditpro.onrender.com/upload", {
      method: "POST",
      body: form
    });

    if (!response.ok) {
      const responseBody = await response.text();
      let errorMessage = "Upload failed.";
      try {
        const errorData = JSON.parse(responseBody);
        errorMessage = errorData.error || errorMessage;
      } catch {
        errorMessage = responseBody;
      }

      if (response.status === 403) {
        statusElem.textContent = "❌ No reports remaining. Please subscribe or wait for your next billing cycle.";
      } else {
        statusElem.textContent = `❌ Upload failed: ${errorMessage}`;
      }
      throw new Error(errorMessage);
    }

    statusElem.textContent = "✅ Report sent to your e-mail.";
  } catch (err) {
    console.error("❌ Upload failed:", err);
    if (!statusElem.textContent.includes("No reports remaining")) {
      statusElem.textContent = `❌ Upload failed: ${err.message}`;
    }
  } finally {
    // Re-enable button and restore color once status is no longer the loading message
    if (statusElem.textContent !== "📤 Uploading and analyzing your ledger...") {
      button.disabled = false;
      button.style.backgroundColor = "#0050ff";
    } else {
      // Failsafe: check again after 1 second
      const checkDone = setInterval(() => {
        if (statusElem.textContent !== "📤 Uploading and analyzing your ledger...") {
          button.disabled = false;
          button.style.backgroundColor = "#0050ff";
          clearInterval(checkDone);
        }
      }, 1000);
    }
  }
}