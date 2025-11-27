const form = document.getElementById("sigForm");
const preview = document.getElementById("signaturePreview");
const copyBtn = document.getElementById("copyBtn");
const resetBtn = document.getElementById("resetBtn");
const statusMessage = document.getElementById("statusMessage");
const departmentSelect = document.getElementById("department");
const customDepartmentInput = document.getElementById("customDepartment");
const emailInput = document.getElementById("email");
const emailError = document.getElementById("emailError");
const phoneInput = document.getElementById("phone");
const phoneError = document.getElementById("phoneError");
const fnameInput = form?.elements["fname"];
const lnameInput = form?.elements["lname"];
const roleInput = form?.elements["role"];
const linkedinInput = form?.elements["linkedin"];
const fnameError = document.getElementById("fnameError");
const lnameError = document.getElementById("lnameError");
const roleError = document.getElementById("roleError");
const departmentError = document.getElementById("departmentError");
const customDepartmentError = document.getElementById("customDepartmentError");
const linkedinError = document.getElementById("linkedinError");

// Basisconfiguratie voor assets en analytics
const ASSET_BASE_URL = `${window.location.origin}/assets`;
const ENABLE_ANALYTICS = true; // Zet op true als je Google Analytics wilt gebruiken
const GA_MEASUREMENT_ID = "G-KFBZF0WNVM";

// Reusable constants & helpers
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const DEFAULT_REGION = "NL";
const ICON_STYLE = "border:0; display:block; width:12px; height:12px; -ms-interpolation-mode:bicubic;";
const ICON_PHONE = `<img src="${ASSET_BASE_URL}/icons/icon-phone.png" alt="Tel" style="${ICON_STYLE}" />`;
const ICON_MAIL = `<img src="${ASSET_BASE_URL}/icons/icon-mail.png" alt="E-mail" style="${ICON_STYLE}" />`;
const ICON_WEB = `<img src="${ASSET_BASE_URL}/icons/icon-web.png" alt="Website" style="${ICON_STYLE}" />`;
const ICON_LINKEDIN = `<img src="${ASSET_BASE_URL}/icons/icon-linkedin.png" alt="LinkedIn" style="${ICON_STYLE}" />`;
const LINK_STYLE = "color:#000000 !important; text-decoration:none !important;";
const LINK_SPAN_STYLE = "color:#000000 !important; text-decoration:none !important;";
const CONTACT_ICON_CELL_STYLE = "width:16px; padding:0; padding-right:8px; padding-bottom:3px; vertical-align:middle;";
const CONTACT_VALUE_CELL_STYLE =
  "font-size:10pt; font-family:Arial, sans-serif; color:#000000!important; font-weight:normal; line-height:18px; mso-line-height-rule:exactly; padding:0; padding-bottom:3px; vertical-align:middle;";
const CONTACT_TABLE_STYLE = "border-collapse:collapse; mso-table-lspace:0pt; mso-table-rspace:0pt;";
const NAME_TABLE_STYLE = "border-collapse:collapse; mso-table-lspace:0pt; mso-table-rspace:0pt;";
const NAME_ROW_SPACING_STYLE = "padding:0; padding-bottom:8px;";
const PERSIST_DEBOUNCE_MS = 150;

function escapeHtml(str = "") {
  return String(str).replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;").replaceAll("'", "&#039;");
}

function isValidEmail(email) {
  return EMAIL_REGEX.test(email);
}

function sanitizePhone(phoneRaw) {
  // Voor tel:-href willen we een strak genormaliseerd nummer, bij voorkeur E.164
  const raw = phoneRaw.trim();
  if (!raw) return "";

  if (window.libphonenumber && typeof window.libphonenumber.parsePhoneNumberFromString === "function") {
    try {
      const phoneNumber = window.libphonenumber.parsePhoneNumberFromString(raw, DEFAULT_REGION);
      if (phoneNumber && phoneNumber.isValid()) {
        return phoneNumber.number; // E.164 formaat, bv. +31642437939
      }
    } catch (e) {
      console.warn("Kon telefoonnummer niet parsen voor tel-link:", e);
    }
  }

  // Fallback: alleen cijfers en + behouden
  return raw.replace(/[^\d+]/g, "");
}

function formatPhoneNumber(phoneRaw) {
  const raw = phoneRaw.trim();
  if (!raw) return "";

  if (window.libphonenumber && typeof window.libphonenumber.parsePhoneNumberFromString === "function") {
    try {
      const phoneNumber = window.libphonenumber.parsePhoneNumberFromString(raw, DEFAULT_REGION);
      if (phoneNumber && phoneNumber.isValid()) {
        // Toon altijd in internationaal formaat met nette spaties
        return phoneNumber.formatInternational();
      }
    } catch (e) {
      console.warn("Kon telefoonnummer niet formatteren:", e);
    }
  }

  // Fallback: simpele opschoning, geen geavanceerde grouping
  return raw.replace(/\s+/g, " ");
}

function buildContactRow(iconHtml, contentHtml) {
  if (!contentHtml) return "";
  return `
        <tr>
          <td width="16" valign="middle" style="${CONTACT_ICON_CELL_STYLE}">
            <font color="#000000">${iconHtml}</font>
          </td>
          <td valign="middle" style="${CONTACT_VALUE_CELL_STYLE}">
          <font color="#000000">
            ${contentHtml}
          </font>
          </td>
        </tr>`;
}

function renderSignature(data) {
  const fname = data.fname?.trim() ? escapeHtml(data.fname.trim()) : '<span class="placeholder">Voornaam</span>';
  const lname = data.lname?.trim() ? escapeHtml(data.lname.trim()) : '<span class="placeholder">Achternaam</span>';
  const role = data.role?.trim() ? escapeHtml(data.role.trim()) : '<span class="placeholder">Functie</span>';
  const department = data.department?.trim() ? escapeHtml(data.department.trim()) : "";
  const note = data.note?.trim() ? escapeHtml(data.note.trim()) : "";

  const phoneRaw = data.phone?.trim() || "";
  const phoneHref = phoneRaw ? sanitizePhone(phoneRaw) : "";
  const phoneDisplay = phoneRaw ? formatPhoneNumber(phoneRaw) : "";
  const phone =
    phoneHref && phoneDisplay
      ? `<a href="tel:${phoneHref}" style="${LINK_STYLE}" target="_blank"><span style="${LINK_SPAN_STYLE}">${escapeHtml(phoneDisplay)}</span></a>`
      : "";

  const emailRaw = data.email?.trim() || "";
  const email = emailRaw
    ? `<a href="mailto:${escapeHtml(emailRaw)}" style="${LINK_STYLE}" target="_blank"><span style="${LINK_SPAN_STYLE}">${escapeHtml(
        emailRaw
      )}</span></a>`
    : '<span class="placeholder">v.achternaam@bospopfestival.nl</span>';

  const website = `<a href="https://bospopfestival.nl/" style="${LINK_STYLE}" target="_blank"><span style="${LINK_SPAN_STYLE}">bospopfestival.nl</span></a>`;

  const linkedinRaw = data.linkedin?.trim() || "";
  const linkedin = linkedinRaw
    ? `<a href="${escapeHtml(
        linkedinRaw
      )}" style="${LINK_STYLE}" target="_blank" rel="noopener noreferrer"><span style="${LINK_SPAN_STYLE}">Voeg me toe op LinkedIn</span></a>`
    : "";

  const contactRows = [
    buildContactRow(ICON_PHONE, phone),
    buildContactRow(ICON_MAIL, email),
    buildContactRow(ICON_WEB, website),
    buildContactRow(ICON_LINKEDIN, linkedin),
  ]
    .filter(Boolean)
    .join("");

  return `
<table role="presentation" cellpadding="0" cellspacing="0" border="0" width="601" align="left"
  style="border-collapse:collapse; mso-table-lspace:0pt; mso-table-rspace:0pt; color:#262626; font-family:Arial, sans-serif; width:601px;">
  <tbody>
    <tr>
      <td width="300" valign="top"
        style="font-size:10pt; font-family:Arial, sans-serif; color:#000000; line-height:18px; mso-line-height-rule:exactly;  padding-top:0; padding-right:20px; padding-bottom:0; padding-left:20px;">
        <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="${NAME_TABLE_STYLE}">
          <tbody>
            <tr>
              <td style="${NAME_ROW_SPACING_STYLE}">
                <span
                  style="font-size:23pt; font-family:'Arial Black', Arial, sans-serif; color:#000000; line-height:26px; mso-line-height-rule:exactly; text-transform:uppercase; font-weight:900; display:block;">
                  ${fname}<br>${lname}
                </span>
              </td>
            </tr>
            <tr>
              <td style="padding:0;">
                <span
                  style="font-size:10pt; font-family:Arial, sans-serif; color:#000000; text-transform:uppercase; font-weight:normal; line-height:18px; mso-line-height-rule:exactly; display:block;">
                  ${role}
                </span>
                ${
                  department
                    ? `<span style="font-size:10pt; font-family:Arial, sans-serif; color:#000000; text-transform:uppercase; font-weight:normal; line-height:18px; mso-line-height-rule:exactly; display:block;">${department}</span>`
                    : ""
                }
              </td>
            </tr>
          </tbody>
        </table>
      </td>
      <td width="1" bgcolor="#000000" style="width: 1px;"></td>
      <td width="300" valign="middle"
        style="font-size:10pt; font-family:Arial, sans-serif; color:#000000; line-height:18px; mso-line-height-rule:exactly; padding-top:0; padding-right:20px; padding-bottom:0; padding-left:20px; vertical-align:middle;">
        <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="${CONTACT_TABLE_STYLE}">
          <tbody>
            ${contactRows}
          </tbody>
        </table>
      </td>
      
    </tr>

    <tr>
      <td colspan="3" style="padding-top:10px; padding-right:0; padding-bottom:0; padding-left:0;">
        <a href="https://www.bospopfestival.nl/e-mailhandtekening/" target="_blank" rel="noopener noreferrer"
          style="text-decoration:none; border:0; outline:0;">
          <img
            src="${ASSET_BASE_URL}/bospop-e-mailhandtekening-footer.png"
            alt="Volg Bospop op social media" width="601" height="36" border="0"
            style="display:block; width:601px; height:36px; max-width:601px; border:0; outline:none; text-decoration:none; -ms-interpolation-mode:bicubic;">
        </a>
      </td>
    </tr>

    ${
      note
        ? `
    <tr>
      <td colspan="3"
        style="max-width:601px; padding-top:10px; padding-right:20px; padding-bottom:10px; padding-left:20px; line-height:11px; mso-line-height-rule:exactly;">
        <span
          style="font-size:9pt; font-family:Arial, sans-serif; color:#000000; line-height:11px; mso-line-height-rule:exactly;">${note}</span>
      </td>
    </tr>`
        : ""
    }
  </tbody>
</table>
`;
}

// UI helpers
function updateDepartmentVisibility() {
  if (departmentSelect.value === "anders") {
    customDepartmentInput.style.display = "block";
  } else {
    customDepartmentInput.style.display = "none";
    customDepartmentInput.value = "";
  }
}

function getFormData() {
  const fd = new FormData(form);
  return {
    fname: fd.get("fname")?.trim(),
    lname: fd.get("lname")?.trim(),
    department: fd.get("department") === "anders" ? fd.get("customDepartment")?.trim() : fd.get("department")?.trim(),
    role: fd.get("role")?.trim(),
    phone: fd.get("phone")?.trim(),
    email: fd.get("email")?.trim(),
    linkedin: fd.get("linkedin")?.trim(),
    note: fd.get("note")?.trim(),
  };
}

function persistFormData(presetData) {
  if (!preview) return;
  const data = presetData || getFormData();
  preview.innerHTML = renderSignature(data);
  localStorage.setItem("bospopSignatureForm", JSON.stringify(data));
}

let persistTimeoutId = null;

function schedulePersistFormData() {
  if (persistTimeoutId) {
    clearTimeout(persistTimeoutId);
  }

  persistTimeoutId = window.setTimeout(() => {
    persistTimeoutId = null;
    persistFormData();
  }, PERSIST_DEBOUNCE_MS);
}

// Status message helper
let statusMessageTimeoutId;

function showStatusMessage(message, type = "success") {
  if (!statusMessage) return;

  statusMessage.textContent = message;
  statusMessage.classList.remove("status-message--success", "status-message--error", "status-message--visible");

  if (type === "error") {
    statusMessage.classList.add("status-message--error");
  } else {
    statusMessage.classList.add("status-message--success");
  }

  statusMessage.classList.add("status-message--visible");

  if (statusMessageTimeoutId) {
    clearTimeout(statusMessageTimeoutId);
  }

  statusMessageTimeoutId = setTimeout(() => {
    statusMessage.classList.remove("status-message--visible");
  }, 4000);
}

// Validatie helpers
function setFieldError(inputEl, errorEl, message) {
  if (!inputEl || !errorEl) return;
  errorEl.textContent = message || "";
  if (message) {
    inputEl.classList.add("field-error");
    inputEl.setAttribute("aria-invalid", "true");
  } else {
    inputEl.classList.remove("field-error");
    inputEl.removeAttribute("aria-invalid");
  }
}

async function handleCopyClick() {
  try {
    await navigator.clipboard.write([
      new ClipboardItem({
        "text/html": new Blob([preview.innerHTML], { type: "text/html" }),
      }),
    ]);
    showStatusMessage("Handtekening gekopieerd. Plak hem nu in je e-mailprogramma.", "success");

    if (ENABLE_ANALYTICS && window.gtagScriptLoaded && window.gtag) {
      window.gtag("event", "copy_signature", {
        event_category: "interaction",
        event_label: "Kopieer handtekening",
      });
    }
  } catch (err) {
    console.error(err);
    showStatusMessage("Kon de handtekening niet kopiëren. Controleer je browserinstellingen en probeer opnieuw.", "error");
  }
}

function handleResetClick() {
  form.reset();
  updateDepartmentVisibility();
  localStorage.removeItem("bospopSignatureForm");
  if (preview) {
    preview.innerHTML = renderSignature({});
  }
  if (emailInput && emailError) {
    setFieldError(emailInput, emailError, "");
  }
  if (phoneInput && phoneError) {
    setFieldError(phoneInput, phoneError, "");
  }
  if (fnameInput && fnameError) {
    setFieldError(fnameInput, fnameError, "");
  }
  if (lnameInput && lnameError) {
    setFieldError(lnameInput, lnameError, "");
  }
  if (roleInput && roleError) {
    setFieldError(roleInput, roleError, "");
  }
  if (departmentSelect && departmentError) {
    setFieldError(departmentSelect, departmentError, "");
  }
  if (customDepartmentInput && customDepartmentError) {
    setFieldError(customDepartmentInput, customDepartmentError, "");
  }
  if (linkedinInput && linkedinError) {
    setFieldError(linkedinInput, linkedinError, "");
  }

  showStatusMessage("Formulier en handtekening zijn gereset.", "success");

  if (ENABLE_ANALYTICS && window.gtagScriptLoaded && window.gtag) {
    window.gtag("event", "reset_form", {
      event_category: "interaction",
      event_label: "Reset handtekening",
    });
  }
}

// Valideer e-mailadres bij verlies van focus
function validateEmailField(showRequiredMessage = false) {
  const email = emailInput.value.trim();

  if (!email) {
    if (showRequiredMessage) {
      setFieldError(emailInput, emailError, "Voer een geldig e-mailadres in.");
    } else {
      setFieldError(emailInput, emailError, "");
    }
    return false;
  }

  if (!isValidEmail(email)) {
    setFieldError(emailInput, emailError, "Ongeldig e-mailadres. Controleer het formaat.");
    return false;
  }

  setFieldError(emailInput, emailError, "");
  return true;
}

function validatePhoneField() {
  if (!phoneInput || !phoneError) return true;
  const value = phoneInput.value.trim();

  // Optioneel veld: leeg is altijd oké
  if (!value) {
    setFieldError(phoneInput, phoneError, "");
    return true;
  }

  if (window.libphonenumber && typeof window.libphonenumber.parsePhoneNumberFromString === "function") {
    try {
      const phoneNumber = window.libphonenumber.parsePhoneNumberFromString(value, DEFAULT_REGION);
      if (!phoneNumber || !phoneNumber.isValid()) {
        setFieldError(phoneInput, phoneError, "Ongeldig telefoonnummer. Controleer het nummer.");
        return false;
      }

      // Nummer is geldig: toon mooi formaat in het invoerveld
      const formatted = phoneNumber.formatInternational();
      phoneInput.value = formatted;
      setFieldError(phoneInput, phoneError, "");
      return true;
    } catch (e) {
      console.warn("Validatie telefoonnummer mislukt:", e);
      setFieldError(phoneInput, phoneError, "Ongeldig telefoonnummer. Controleer het nummer.");
      return false;
    }
  }

  // Fallback: simpele lengtecheck als library niet beschikbaar is
  const digits = value.replace(/\D/g, "");
  if (digits.length < 8) {
    setFieldError(phoneInput, phoneError, "Ongeldig telefoonnummer. Controleer het nummer.");
    return false;
  }

  setFieldError(phoneInput, phoneError, "");
  return true;
}

function isValidLinkedinUrl(url) {
  // Sta alleen volledige LinkedIn-URL's toe, bijvoorbeeld:
  // https://www.linkedin.com/in/jouwprofiel of /company/ etc.
  const value = url.trim();
  if (!value) return true;

  // Als gebruiker geen protocol invult maar wel met linkedin.com begint, voeg https toe voor de check
  let testValue = value;
  if (!/^https?:\/\//i.test(testValue) && /^([^/:]+)\./.test(testValue)) {
    testValue = "https://" + testValue;
  }

  const pattern = /^https?:\/\/([a-z]{2,3}\.)?linkedin\.com\/.+/i;
  return pattern.test(testValue);
}

function validateLinkedinField() {
  if (!linkedinInput || !linkedinError) return true;
  const value = linkedinInput.value.trim();

  // Optioneel veld: leeg is oké
  if (!value) {
    setFieldError(linkedinInput, linkedinError, "");
    return true;
  }

  if (!isValidLinkedinUrl(value)) {
    setFieldError(
      linkedinInput,
      linkedinError,
      "Ongeldige LinkedIn URL. Gebruik een volledige URL, bijvoorbeeld https://www.linkedin.com/in/jouwprofiel."
    );
    return false;
  }

  setFieldError(linkedinInput, linkedinError, "");
  return true;
}

function validateRequiredInput(inputEl, errorEl, message) {
  if (!inputEl || !errorEl) return true;
  const value = inputEl.value.trim();
  if (!value) {
    setFieldError(inputEl, errorEl, message);
    return false;
  }
  setFieldError(inputEl, errorEl, "");
  return true;
}

function validateDepartmentFields() {
  let ok = true;
  const value = departmentSelect.value;
  if (!value) {
    if (departmentError) {
      setFieldError(departmentSelect, departmentError, "Kies een afdeling of 'Anders'.");
    }
    ok = false;
  } else {
    if (departmentError) {
      setFieldError(departmentSelect, departmentError, "");
    }
    if (value === "anders") {
      const customVal = customDepartmentInput.value.trim();
      if (!customVal) {
        if (customDepartmentError) {
          setFieldError(customDepartmentInput, customDepartmentError, "Vul een afdelingsnaam in of kies een andere optie bij afdeling.");
        }
        ok = false;
      } else if (customDepartmentError) {
        setFieldError(customDepartmentInput, customDepartmentError, "");
      }
    } else if (customDepartmentError) {
      // bij andere keuze: custom veld leeg en geen fout
      setFieldError(customDepartmentInput, customDepartmentError, "");
    }
  }
  return ok;
}

function validateFormOnSubmit() {
  const results = [];

  results.push(validateRequiredInput(fnameInput, fnameError, "Vul je voornaam in."));
  results.push(validateRequiredInput(lnameInput, lnameError, "Vul je achternaam in."));
  results.push(validateRequiredInput(roleInput, roleError, "Vul je functie in."));
  results.push(validateDepartmentFields());

  const emailOk = validateEmailField(true);
  const phoneOk = validatePhoneField();
  const linkedinOk = validateLinkedinField();

  results.push(emailOk, phoneOk, linkedinOk);

  return results.every(Boolean);
}

// Herstel formuliervelden uit localStorage bij laden van de pagina
window.addEventListener("DOMContentLoaded", () => {
  if (!form) {
    console.warn("Handtekening formulier niet gevonden; initialisatie overgeslagen.");
    return;
  }
  const saved = localStorage.getItem("bospopSignatureForm");
  if (saved) {
    const data = JSON.parse(saved);
    if (data.fname) form.elements["fname"].value = data.fname;
    if (data.lname) form.elements["lname"].value = data.lname;

    if (data.department) {
      const found = Array.from(departmentSelect.options).some((opt) => opt.value === data.department);
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
    if (data.linkedin) form.elements["linkedin"].value = data.linkedin;
    if (data.note) form.elements["note"].value = data.note;
  }

  // Initial render
  persistFormData();

  // Event listeners
  departmentSelect.addEventListener("change", () => {
    updateDepartmentVisibility();
    validateDepartmentFields();
  });
  if (customDepartmentInput) {
    customDepartmentInput.addEventListener("input", () => validateDepartmentFields());
  }
  form.addEventListener("input", (e) => {
    schedulePersistFormData();
    const target = e.target;
    if (target === fnameInput) {
      validateRequiredInput(fnameInput, fnameError, "Vul je voornaam in.");
    } else if (target === lnameInput) {
      validateRequiredInput(lnameInput, lnameError, "Vul je achternaam in.");
    } else if (target === roleInput) {
      validateRequiredInput(roleInput, roleError, "Vul je functie in.");
    } else if (target === emailInput) {
      validateEmailField(false);
    } else if (target === linkedinInput) {
      validateLinkedinField();
    }
  });
  emailInput.addEventListener("blur", () => validateEmailField(true));
  if (linkedinInput) {
    linkedinInput.addEventListener("blur", () => validateLinkedinField());
  }
  if (phoneInput) {
    phoneInput.addEventListener("blur", () => validatePhoneField());
    phoneInput.addEventListener("input", () => {
      validatePhoneField();
    });
  }
  form.addEventListener("submit", (e) => {
    const isValid = validateFormOnSubmit();
    if (!isValid) {
      e.preventDefault();
      // Focus op eerste foutveld
      const firstErrorField = document.querySelector(".field-error") || emailInput || form.querySelector("input, select, textarea");
      if (firstErrorField && typeof firstErrorField.focus === "function") {
        firstErrorField.focus();
      }
    }
  });

  if (copyBtn) {
    copyBtn.addEventListener("click", handleCopyClick);
  }
  if (resetBtn) {
    resetBtn.addEventListener("click", handleResetClick);
  }

  // Cookie Consent & Google Analytics logic
  function showCookieBanner() {
    const banner = document.getElementById("cookieConsent");
    if (!banner) return;

    if (!localStorage.getItem("cookieConsent")) {
      banner.classList.add("show");
    } else {
      banner.classList.remove("show");
    }
  }

  function loadGA() {
    if (!ENABLE_ANALYTICS || !GA_MEASUREMENT_ID) {
      return;
    }

    if (!window.gtagScriptLoaded) {
      const script = document.createElement("script");
      script.async = true;
      script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
      document.head.appendChild(script);

      window.dataLayer = window.dataLayer || [];
      function gtag() {
        window.dataLayer.push(arguments);
      }

      window.gtag = gtag;
      gtag("js", new Date());
      gtag("config", GA_MEASUREMENT_ID, { anonymize_ip: true });
      window.gtagScriptLoaded = true;
    }
  }

  if (ENABLE_ANALYTICS) {
    showCookieBanner();
  } else {
    const banner = document.getElementById("cookieConsent");
    if (banner) {
      banner.classList.remove("show");
    }
  }

  const acceptBtn = document.getElementById("acceptCookies");
  const declineBtn = document.getElementById("declineCookies");

  if (ENABLE_ANALYTICS && acceptBtn) {
    acceptBtn.addEventListener("click", function () {
      localStorage.setItem("cookieConsent", "accepted");
      const banner = document.getElementById("cookieConsent");
      if (banner) {
        banner.classList.remove("show");
      }
      loadGA();
    });
  }

  if (ENABLE_ANALYTICS && declineBtn) {
    declineBtn.addEventListener("click", function () {
      localStorage.setItem("cookieConsent", "declined");
      const banner = document.getElementById("cookieConsent");
      if (banner) {
        banner.classList.remove("show");
      }
    });
  }

  // If already accepted, load GA
  if (ENABLE_ANALYTICS && localStorage.getItem("cookieConsent") === "accepted") {
    loadGA();
  }
});
