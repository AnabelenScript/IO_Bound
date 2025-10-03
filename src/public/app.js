async function getOrders() {
  const res = await fetch('/orders');
  const data = await res.json();
  document.getElementById('output').textContent = JSON.stringify(data, null, 2);
}

async function addOrder() {
  const res = await fetch('/orders', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      cliente: "Cliente Web",
      producto: "Concha",
      cantidad: 2
    })
  });
  const data = await res.json();
  document.getElementById('output').textContent = JSON.stringify(data, null, 2);
}

async function getStream() {
  const res = await fetch('/stream');
  const text = await res.text();
  document.getElementById('output').textContent = text;
}

async function getExternal() {
  const res = await fetch('/external');
  const data = await res.json();
  document.getElementById('output').textContent = JSON.stringify(data, null, 2);
}
