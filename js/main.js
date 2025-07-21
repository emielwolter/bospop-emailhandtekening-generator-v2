const form = document.getElementById("sigForm");
const preview = document.getElementById("signaturePreview");
const copyBtn = document.getElementById("copyBtn");
const departmentSelect = document.getElementById("department");
const customDepartmentInput = document.getElementById("customDepartment");
const emailInput = document.getElementById("email");
const emailError = document.getElementById("emailError");

function renderSignature(data) {
  const website = `<a href="https://bospopfestival.nl/" style="text-decoration: none; color: #000;">bospopfestival.nl</a>`;
  const fname = data.fname || '<span class="placeholder">Voornaam</span>';
  const lname = data.lname || '<span class="placeholder">Achternaam</span>';
  const role = data.role || '<span class="placeholder">Functie</span>';
  const department =
    data.department || '<span class="placeholder">Afdeling</span>';
  const phone = data.phone
    ? `<a href="tel:${data.phone}" style="text-decoration: none; color: #000;">${data.phone}</a>`
    : ""; // No placeholder if phone is empty
  const email = data.email
    ? `<a href="mailto:${data.email}" style="text-decoration: none; color: #000;">${data.email}</a>`
    : '<span class="placeholder">v.achternaam@bospopfestival.nl</span>';
  const note = data.note || "";
  return `
    <table cellspacing="0" cellpadding="0" border="0" style="COLOR: #262626; FONT-FAMILY: Arial, sans-serif; width:600px;">      
        <tbody>
            <tr>
                <td style="FONT-SIZE: 10pt; FONT-FAMILY: Arial, sans-serif; WIDTH:300px; COLOR: #000; line-height: 18px; border-right: solid 1px #000; padding: 0 20px;">
                    <span style="FONT-SIZE: 23pt; FONT-FAMILY: Arial, sans-serif; COLOR: #000; line-height: 26px; text-transform: uppercase; font-weight: 900">${fname}<br>${lname}</span><br/>
                    <span style="FONT-SIZE: 10pt; FONT-FAMILY: Arial, sans-serif; COLOR: #000; text-transform: uppercase; font-weight: bold">${role}</span><br/>
                    <span style="FONT-SIZE: 10pt; FONT-FAMILY: Arial, sans-serif; COLOR: #000; text-transform: uppercase; font-weight: bold">${department}</span>
                </td>
                <td style="FONT-SIZE: 10pt; width: 300px; line-height: 18px; padding: 0 20px;">
                    ${
                      phone
                        ? `<span style="FONT-SIZE: 10pt; FONT-FAMILY: Arial, sans-serif; COLOR: #000; font-weight: bold;">${phone}</span><br/>`
                        : ""
                    }
                    <span style="FONT-SIZE: 10pt; FONT-FAMILY: Arial, sans-serif; COLOR: #000; font-weight: bold;">${email}</span><br/>
                    <span style="FONT-SIZE: 10pt; FONT-FAMILY: Arial, sans-serif; COLOR: #000; font-weight: bold;">${website}</span><br/>
                </td>
            </tr>
            <tr>
                <td colspan="2" style="padding-top: 10px; max-width:600px;">
                    <a href="https://www.bospopfestival.nl/e-mailhandtekening/" target="_blank"><img border="0" src="https://bospop-emailhandtekening-generator.vercel.app/assets/bospop-e-mailhandtekening-footer.png" alt="Social Media footer" width="600" style="max-width:600px; height:36px; border:0;"></a>
                </td>
            </tr>
            ${
              note
                ? `
              <tr>
                  <td colspan="2" style="max-width:600px; padding: 10px 20px;">
                      <span style="FONT-SIZE: 9pt; FONT-FAMILY: Arial, sans-serif; COLOR: #000; line-height: 11px;">${note}</span>
                  </td>
              </tr>
              `
                : ""
            }
        </tbody>
    </table>
  `;
}

// Toon/verberg het extra inputveld op basis van de selectie
departmentSelect.addEventListener("change", () => {
  if (departmentSelect.value === "anders") {
    customDepartmentInput.style.display = "block";
  } else {
    customDepartmentInput.style.display = "none";
    customDepartmentInput.value = ""; // Reset de waarde als het verborgen wordt
  }
});

// Update de handtekening bij invoer in het formulier en sla op in localStorage
form.addEventListener("input", () => {
  const fd = new FormData(form);
  const data = {
    fname: fd.get("fname")?.trim(),
    lname: fd.get("lname")?.trim(),
    department:
      fd.get("department") === "anders"
        ? fd.get("customDepartment")?.trim()
        : fd.get("department")?.trim(),
    role: fd.get("role")?.trim(),
    phone: fd.get("phone")?.trim(),
    email: fd.get("email")?.trim(),
    note: fd.get("note")?.trim(),
  };
  preview.innerHTML = renderSignature(data);
  // Save to localStorage
  localStorage.setItem("bospopSignatureForm", JSON.stringify(data));
});

// Kopieer de handtekening naar het klembord
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

// Valideer e-mailadres bij verlies van focus
emailInput.addEventListener("blur", () => {
  const email = emailInput.value.trim();

  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    emailError.textContent = "Ongeldig e-mailadres. Controleer het formaat.";
  } else {
    emailError.textContent = ""; // Clear error message if valid
  }
});

// Valideer e-mailadres bij formulierverzending
form.addEventListener("submit", (e) => {
  const email = emailInput.value.trim();

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    e.preventDefault();
    emailError.textContent = "Voer een geldig e-mailadres in.";
    emailInput.focus(); // Focus the email field for correction
  }
});

// Herstel formuliervelden uit localStorage bij laden van de pagina
window.addEventListener("DOMContentLoaded", () => {
  const saved = localStorage.getItem("bospopSignatureForm");
  if (saved) {
    const data = JSON.parse(saved);
    if (data.fname) form.elements["fname"].value = data.fname;
    if (data.lname) form.elements["lname"].value = data.lname;
    if (data.department) {
      // Check if department is one of the select options
      const found = Array.from(departmentSelect.options).some(
        (opt) => opt.value === data.department
      );
      if (found) {
        departmentSelect.value = data.department;
        customDepartmentInput.style.display = "none";
        customDepartmentInput.value = "";
      } else {
        departmentSelect.value = "anders";
        customDepartmentInput.style.display = "block";
        customDepartmentInput.value = data.department;
      }
    }
    if (data.role) form.elements["role"].value = data.role;
    if (data.phone) form.elements["phone"].value = data.phone;
    if (data.email) form.elements["email"].value = data.email;
    if (data.note) form.elements["note"].value = data.note;
  }
  // Trigger rendering
  form.dispatchEvent(new Event("input"));
});
