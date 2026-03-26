document.getElementById("login-btn").onclick = async () => {
  const username = document.getElementById("login-user").value.trim();
  const password = document.getElementById("login-pass").value.trim();

  const res = await fetch("/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password })
  });

  const data = await res.json();

  if (!data.success) {
    document.getElementById("login-error").style.display = "block";
    return;
  }

  localStorage.setItem("bean-token", data.token);
  window.location.href = "items.html";
};
