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
    : '<span class="placeholder">v.achternaam@bospopfestival.nl</span>';
  return `
    <table cellspacing="0" cellpadding="0" border="0" style="COLOR: #262626; FONT-FAMILY: Arial, sans-serif; width:600px;">      
        <tbody>
            <tr>
                <td style="FONT-SIZE: 10pt; FONT-FAMILY: Arial, sans-serif; WIDTH:300px; COLOR: #000; line-height: 18px; border-right: solid 1px #000;">
                    <span style="FONT-SIZE: 23pt; FONT-FAMILY: Arial Black, Arial, sans-serif; COLOR: #000; text-transform: uppercase;">${name}</span><br/>
                    <span style="FONT-SIZE: 10pt; FONT-FAMILY: Arial, sans-serif; COLOR: #000; font-weight: bold">${department}</span><br/>
                    <span style="FONT-SIZE: 10pt; FONT-FAMILY: Arial, sans-serif; COLOR: #000; font-weight: bold">${role}</span>
                </td>
                <td style="FONT-SIZE: 10pt; width: 300px; line-height: 18px; padding-left: 10px;">
                    <span style="FONT-SIZE: 10pt; FONT-FAMILY: Arial, sans-serif; COLOR: #000; font-weight: bold;">${phone}</span><br/>
                    <span style="FONT-SIZE: 10pt; FONT-FAMILY: Arial, sans-serif; COLOR: #000; font-weight: bold;">${email}</span><br/>
                    <span style="FONT-SIZE: 10pt; FONT-FAMILY: Arial, sans-serif; COLOR: #000; font-weight: bold;">bospopfestival.nl</span><br/>
                </td>
            </tr>
        </tbody>
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
