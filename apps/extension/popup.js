async function refresh() {
  const { integroToken, integroUser } = await chrome.storage.local.get(["integroToken", "integroUser"]);
  document.getElementById("status").textContent = integroToken
    ? `Вход выполнен: ${integroUser?.name || "пользователь"}`
    : "Вход не выполнен";
}

document.getElementById("login").addEventListener("click", () => {
  chrome.runtime.sendMessage({ type: "integro-start-login" }, refresh);
});

document.getElementById("logout").addEventListener("click", () => {
  chrome.runtime.sendMessage({ type: "integro-logout" }, refresh);
});

refresh();
