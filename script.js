async function handleUpload() {
  const fileInput = document.getElementById("fileInput");
  const status = document.getElementById("status");

  if (fileInput.files.length === 0) {
    status.textContent = "Please select a file first.";
    return;
  }

  const file = fileInput.files[0];

  const formData = new FormData();
  formData.append("file", file);

  status.textContent = "Processing... Please wait.";

  try {
    const response = await fetch("https://aiauditpro.onrender.com/upload", {
      method: "POST",
      body: formData
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Unknown error from server.");
    }

    const blob = await response.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "AiAuditExpert_Report.pdf";
    a.click();

    status.textContent = "✅ Report downloaded successfully.";
  } catch (err) {
    console.error(err);
    status.textContent = "❌ " + err.message;
  }
}
