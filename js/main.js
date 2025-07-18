const form = document.getElementById("sigForm");
const preview = document.getElementById("signaturePreview");
const copyBtn = document.getElementById("copyBtn");

function renderSignature(data) {
  const name =
    data.name || '<span class="placeholder">Voornaam Achternaam</span>';
  const role = data.role || '<span class="placeholder">Functie</span>';
  const department =
    data.department || '<span class="placeholder">Afdeling</span>';
  const phone = data.phone
    ? `<a href="tel:${data.phone}">${data.phone}</a>`
    : '<span class="placeholder">+31 6 12345678</span>';
  const email = data.email
    ? `<a href="mailto:${data.email}">${data.email}</a>`
    : '<span class="placeholder">naam@bedrijf.nl</span>';
  return `
    <table class="sig-table" cellpadding="0" cellspacing="0">
      <tr>
        <td>
          <strong>${name}</strong><br/>
          ${role}<br/>
          ${department}<br/>
          ${phone}<br/>
          ${email}
        </td>
      </tr>
    </table>
  `;
}

form.addEventListener("input", () => {
  const fd = new FormData(form);
  const data = {
    name: fd.get("name")?.trim(),
    department: fd.get("department")?.trim(),
    role: fd.get("role")?.trim(),
    phone: fd.get("phone")?.trim(),
    email: fd.get("email")?.trim(),
  };
  preview.innerHTML = renderSignature(data);
});

copyBtn.addEventListener("click", async () => {
  try {
    await navigator.clipboard.write([
      new ClipboardItem({
        "text/html": new Blob([preview.innerHTML], { type: "text/html" }),
      }),
    ]);
    alert("Handtekening gekopieerd!");
  } catch (err) {
    console.error(err);
    alert("Kon niet kopiëren. Controleer je browserinstellingen.");
  }
});

form.dispatchEvent(new Event("input"));
