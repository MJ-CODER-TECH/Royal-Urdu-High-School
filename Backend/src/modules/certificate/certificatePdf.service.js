const fs = require("fs");
const path = require("path");
const PDFDocument = require("pdfkit");
const repository = require("./certificate.repository");
const service = require("./certificate.service");
const whatsappService = require("../whatsapp/whatsapp.service");
const studentRepository = require("../student/student.repository");

/**
 * ==========================================
 * THEME (matches the reference certificate design)
 * ==========================================
 * 
 */




const COLORS = {
  pageBg: "#faf6f0", // light cream background
  primary: "#2b2560", // dark navy/purple - title + bold fields
  textGray: "#4a4a4a",
  lineGray: "#999999",
};

// A4 LANDSCAPE
const PAGE = { width: 841.89, height: 595.28 };

// A4 PORTRAIT (used only by the official-style Bonafide layout below)
const PAGE_PORTRAIT = { width: 595.28, height: 841.89 };

/**
 * Writes a paragraph centered on the page, auto bold+underlining any
 * string in `highlights`.
 *
 * IMPORTANT: pdfkit's `align: 'center'` breaks when combined with
 * `continued: true` (multi-style inline text) - it causes overlapping
 * text. To avoid that, each line's total width is measured manually
 * and the starting X is computed by hand, then segments are streamed
 * with `continued: true` WITHOUT ever passing `align` again.
 */
function writeHighlightedParagraphCentered(
  doc,
  paragraph,
  highlights,
  { x, width, fontSize, lineGap = 8 },
) {
  const escaped = highlights
    .filter(Boolean)
    .map((h) => h.toString().trim())
    .filter((h) => h.length)
    .sort((a, b) => b.length - a.length)
    .map((h) => h.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"));

  const pattern = escaped.length
    ? new RegExp("(" + escaped.join("|") + ")", "g")
    : null;
  const lines = paragraph.split("\n");

  doc.fontSize(fontSize);

  lines.forEach((line) => {
    if (line.trim() === "") {
      doc.moveDown(0.6);
      return;
    }

    let segments = [];
    if (pattern) {
      let lastIndex = 0;
      let m;
      pattern.lastIndex = 0;
      while ((m = pattern.exec(line)) !== null) {
        if (m.index > lastIndex)
          segments.push({ text: line.slice(lastIndex, m.index), bold: false });
        segments.push({ text: m[0], bold: true });
        lastIndex = pattern.lastIndex;
      }
      if (lastIndex < line.length)
        segments.push({ text: line.slice(lastIndex), bold: false });
    } else {
      segments = [{ text: line, bold: false }];
    }

    const words = [];
    segments.forEach((seg) => {
      seg.text.split(/(\s+)/).forEach((tok) => {
        if (tok.length) words.push({ text: tok, bold: seg.bold });
      });
    });

    let rows = [];
    let row = [];
    let rowWidth = 0;
    words.forEach((w) => {
      doc.font(w.bold ? "Helvetica-Bold" : "Helvetica");
      const wWidth = doc.widthOfString(w.text);
      if (rowWidth + wWidth > width && row.length) {
        rows.push(row);
        row = [];
        rowWidth = 0;
      }
      row.push(w);
      rowWidth += wWidth;
    });
    if (row.length) rows.push(row);

    rows.forEach((r) => {
      while (r.length && /^\s+$/.test(r[0].text)) r.shift();
      while (r.length && /^\s+$/.test(r[r.length - 1].text)) r.pop();

      let totalWidth = 0;
      r.forEach((w) => {
        doc.font(w.bold ? "Helvetica-Bold" : "Helvetica");
        totalWidth += doc.widthOfString(w.text);
      });

      const startX = x + Math.max(0, (width - totalWidth) / 2);
      const y = doc.y;

      r.forEach((w, i) => {
        const isLast = i === r.length - 1;
        doc
          .font(w.bold ? "Helvetica-Bold" : "Helvetica")
          .fillColor(w.bold ? COLORS.primary : "#222222");

        if (i === 0) {
          doc.text(w.text, startX, y, {
            continued: !isLast,
            underline: w.bold,
          });
        } else {
          doc.text(w.text, { continued: !isLast, underline: w.bold });
        }
      });

      doc.moveDown(0.15);
    });

    doc.y += lineGap;
  });

  doc.fillColor("#000000");
}

/**
 * Left-aligned inline text with auto bold+underline highlighting.
 * Used by the official-style Bonafide certificate below.
 * (align:'left' + continued is safe in pdfkit; the overlap bug only
 * happens with align:'center', which is why the function above needs
 * the manual-centering workaround and this one doesn't.)
 */
function writeInlineHighlighted(
  doc,
  text,
  highlights,
  {
    x,
    y,
    width,
    fontSize,
    regularFont = "Helvetica-Oblique",
    boldFont = "Helvetica-BoldOblique",
    boldOnly = [],
    boldOnlyFont = "Helvetica-Bold",
    color = "#111111",
  },
) {
  const clean = (list) =>
    list
      .filter(Boolean)
      .map((h) => h.toString().trim())
      .filter((h) => h.length);

  // Each term keeps its original (unescaped) text alongside its tag and
  // an escaped version for regex use, so lookup after matching is exact.
  const terms = [
    ...clean(highlights).map((t) => ({ original: t, tag: "underline" })),
    ...clean(boldOnly).map((t) => ({ original: t, tag: "bold" })),
  ].sort((a, b) => b.original.length - a.original.length);

  terms.forEach((o) => {
    o.escaped = o.original.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  });

  const pattern = terms.length
    ? new RegExp("(" + terms.map((o) => o.escaped).join("|") + ")", "g")
    : null;

  let segments = [];
  if (pattern) {
    let lastIndex = 0;
    let m;
    while ((m = pattern.exec(text)) !== null) {
      if (m.index > lastIndex)
        segments.push({ text: text.slice(lastIndex, m.index), tag: "plain" });
      const matched = terms.find((o) => o.original === m[0]);
      segments.push({ text: m[0], tag: matched ? matched.tag : "underline" });
      lastIndex = pattern.lastIndex;
    }
    if (lastIndex < text.length)
      segments.push({ text: text.slice(lastIndex), tag: "plain" });
  } else {
    segments = [{ text, tag: "plain" }];
  }

  doc.fontSize(fontSize);

  const fontFor = (tag) =>
    tag === "underline"
      ? boldFont
      : tag === "bold"
        ? boldOnlyFont
        : regularFont;

  segments.forEach((seg, i) => {
    const isLast = i === segments.length - 1;
    doc.font(fontFor(seg.tag)).fillColor(color);
    if (i === 0) {
      doc.text(seg.text, x, y, {
        continued: !isLast,
        underline: seg.tag === "underline",
        width,
      });
    } else {
      doc.text(seg.text, {
        continued: !isLast,
        underline: seg.tag === "underline",
      });
    }
  });

  doc.fillColor("#000000");
}

/**
 * Draws a row of empty/filled digit boxes (used for the Aadhar number
 * row on the official-style Bonafide certificate).
 */
function drawDigitBoxes(doc, x, y, digits, count = 12, boxSize = 24) {
  const chars = (digits || "").toString().replace(/\D/g, "").split("");
  for (let i = 0; i < count; i++) {
    const bx = x + i * boxSize;
    doc
      .rect(bx, y, boxSize, boxSize)
      .lineWidth(0.75)
      .strokeColor("#333333")
      .stroke();
    if (chars[i]) {
      doc
        .fontSize(12)
        .font("Helvetica")
        .fillColor("#111111")
        .text(chars[i], bx, y + boxSize / 2 - 6, {
          width: boxSize,
          align: "center",
        });
    }
  }
  doc.fillColor("#000000");
}

/**
 * ==========================================
 * Common PDF Generator (used by TC / LC / Character certificates)
 * ==========================================
 */
exports.generatePdf = async ({
  title,
  student,
  certificate,
  content,
  outputPath,
  school,
  highlights = [],
}) => {
  const dir = path.dirname(outputPath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  const doc = new PDFDocument({ size: "A4", layout: "landscape", margin: 0 });
  const stream = fs.createWriteStream(outputPath);
  doc.pipe(stream);

  const marginX = 70;
  const contentW = PAGE.width - marginX * 2;

  doc.rect(0, 0, PAGE.width, PAGE.height).fill(COLORS.pageBg);

  let y = 60;

  const logo = school.logo_path
    ? path.join(process.cwd(), school.logo_path)
    : null;
  if (logo && fs.existsSync(logo)) {
    doc.image(logo, marginX, y, { width: 130 });
  }

  doc
    .fillColor(COLORS.primary)
    .fontSize(30)
    .font("Helvetica-Bold")
    .text(school.school_name || "", marginX, y, {
      width: contentW,
      align: "center",
    });

  y = doc.y + 18;

  doc
    .fillColor(COLORS.primary)
    .fontSize(22)
    .font("Helvetica-Bold")
    .text(title.toUpperCase(), marginX, y, {
      width: contentW,
      align: "center",
    });

  y = doc.y + 20;

  doc
    .fillColor(COLORS.textGray)
    .fontSize(9)
    .font("Helvetica")
    .text(
      `Certificate No: ${certificate.certificate_no}      Issue Date: ${certificate.issue_date}`,
      marginX,
      y,
      { width: contentW, align: "center" },
    );

  y = doc.y + 24;

  if (student.photo && fs.existsSync(student.photo)) {
    doc.image(student.photo, marginX + contentW - 75, y, {
      width: 75,
      height: 92,
    });
  }

  doc.y = y;
  const bodyWidth = contentW - 160;
  writeHighlightedParagraphCentered(doc, content, highlights, {
    x: marginX + (contentW - bodyWidth) / 2,
    width: bodyWidth,
    fontSize: 12.5,
    lineGap: 8,
  });

  const minFooterY = PAGE.height - 150;
  const footerY = Math.max(doc.y + 40, minFooterY - 60);
  const lineY = Math.min(footerY, PAGE.height - 90);

  const sigX1 = marginX + 20;
  const sigX2 = sigX1 + 150;

  const sign = school.principle_signature_path
    ? path.join(process.cwd(), school.principle_signature_path)
    : null;
  if (sign && fs.existsSync(sign)) {
    doc.image(sign, sigX1 + 20, lineY - 40, { width: 90 });
  }

  doc
    .moveTo(sigX1, lineY)
    .lineTo(sigX2, lineY)
    .lineWidth(1)
    .strokeColor(COLORS.lineGray)
    .stroke();

  doc
    .fillColor(COLORS.textGray)
    .fontSize(10)
    .font("Helvetica")
    .text("Signature,", sigX1, lineY + 6)
    .text(
      school.principle_name ? school.principle_name : "Principal",
      sigX1,
      doc.y,
    );

  const stamp = school.school_stamp_path
    ? path.join(process.cwd(), school.school_stamp_path)
    : null;
  const stampBox = 115;
  const stampCx = PAGE.width / 2;
  if (stamp && fs.existsSync(stamp)) {
    doc.image(stamp, stampCx - stampBox / 2, lineY - stampBox + 30, {
      fit: [stampBox, stampBox],
      align: "center",
      valign: "center",
    });
  }
  doc
    .fontSize(9)
    .fillColor(COLORS.textGray)
    .font("Helvetica")
    .text("Organization Seal", stampCx - 60, lineY + 6, {
      width: 120,
      align: "center",
    });

  const dateX2 = marginX + contentW - 20;
  const dateX1 = dateX2 - 150;

  doc
    .moveTo(dateX1, lineY)
    .lineTo(dateX2, lineY)
    .lineWidth(1)
    .strokeColor(COLORS.lineGray)
    .stroke();

  doc
    .fontSize(10)
    .fillColor(COLORS.textGray)
    .text(certificate.issue_date, dateX1, lineY - 16, {
      width: dateX2 - dateX1,
      align: "left",
    });
  doc.text("Date", dateX1, lineY + 6, {
    width: dateX2 - dateX1,
    align: "left",
  });

  doc.fillColor("#000000");
  doc.end();

  return new Promise((resolve) => {
    stream.on("finish", () => resolve(outputPath));
  });
};

/**
 * ==========================================
 * Bonafide Certificate — official form-style layout
 * (matches the reference photo: bold black title, underline, italic
 * body text with underlined blanks, Aadhar digit-box row, seal +
 * signature footer)
 * ==========================================
 */
exports.generateBonafidePdf = async (studentId, generatedBy = "Admin") => {
  const { student, school, academicYear } =
    await service.getBonafideData(studentId);

  const certificate = await service.createCertificate({
    student_id: student.student_id,
    certificate_type: "Bonafide",
    issue_date: new Date().toISOString().split("T")[0],
    generated_by: generatedBy,
    remarks: "Bonafide Certificate",
  });

  const outputPath = path.join(
    process.cwd(),
    "uploads",
    "certificates",
    `${certificate.certificate_no}.pdf`,
  );

  // fix: fallback in case year_start/year_end fields are missing/misnamed in service response
  const yearStart = academicYear?.year_start ?? academicYear?.start_year ?? "";
  const yearEnd = academicYear?.year_end ?? academicYear?.end_year ?? "";
  const academicYearLabel =
    yearStart || yearEnd ? `${yearStart}-${yearEnd}` : "N/A";

  // These fields may not exist yet in your student table — falls back
  // gracefully to blanks/dashes if missing so the layout never breaks.
  const dob =
    student.dob || student.date_of_birth
      ? new Date(student.dob || student.date_of_birth).toLocaleDateString(
          "en-GB",
        )
      : "-";
  const grNo =
    student.gr_no || student.general_register_no || student.roll_no || "-";
  const aadharNo = (
    student.aadhaar ||
    student.aadhar_no ||
    student.adhar_no ||
    ""
  ).toString();
  const classLabel = student.section_name
    ? `${student.class_name} - ${student.section_name}`
    : student.class_name || "-";

  const dir = path.dirname(outputPath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  const doc = new PDFDocument({ size: "A4", layout: "landscape", margin: 0 });
  const stream = fs.createWriteStream(outputPath);
  doc.pipe(stream);

  const marginX = 70;
  const pageW = PAGE.width; // landscape width (841.89)
  const pageH = PAGE.height; // landscape height (595.28)
  const bodyWidth = pageW - marginX * 2;

  // white background
  doc.rect(0, 0, pageW, pageH).fill("#ffffff");

  // small cert no / date, top-right (kept subtle — not part of the reference photo but needed for records)
  doc
    .fontSize(8)
    .fillColor("#888888")
    .font("Helvetica")
    .text(
      ` Issue Date: ${new Date().toLocaleDateString()}`,
      pageW - marginX - 260,
      20,
      { width: 260, align: "right" },
    );

  // Title (shifted down from the very top so the whole block sits
  // vertically centered on the page instead of leaving a big empty
  // gap below the footer)
  const topOffset = 70;
  doc
    .fillColor("#111111")
    .fontSize(26)
    .font("Helvetica-Bold")
    .text("BONAFIDE CERTIFICATE", marginX, 40 + topOffset, {
      width: bodyWidth,
      align: "center",
    });

  // underline below title
  let lineY = doc.y + 10;
  doc
    .moveTo(marginX - 10, lineY)
    .lineTo(pageW - marginX + 10, lineY)
    .lineWidth(1.5)
    .strokeColor("#111111")
    .stroke();

  let by = lineY + 20;

  // UDISE NO
  doc
    .fontSize(12)
    .font("Helvetica-BoldOblique")
    .fillColor("#111111")
    .text(`UDISE NO:- ${school.udise_no || "-"}`, marginX, by);

  by = doc.y + 18;

  // Body — line 1
  writeInlineHighlighted(
    doc,
    `This is to certify that Mr./Ms. ${student.student_name}`,
    [student.student_name],
    { x: marginX, y: by, width: bodyWidth, fontSize: 13 },
  );
  by = doc.y + 14;

  // Body — line 2
  writeInlineHighlighted(
    doc,
    `His/Her DOB ${dob}  Bearing General Register Number ${grNo}  is a student of Class ${classLabel} & his/her Aadhar number`,
    [dob, grNo, classLabel],
    { x: marginX, y: by, width: bodyWidth, fontSize: 13 },
  );
  by = doc.y + 12;

  // Aadhar digit boxes
  drawDigitBoxes(doc, marginX, by, aadharNo, 12, 24);
  by += 24 + 18;

  // Body — line 3
  writeInlineHighlighted(
    doc,
    `For the academic year ${academicYearLabel}. He/She is a bonafide student of ${school.school_name}. He/She is Reliable, sincere, hardworking and bears a good moral character in school.`,
    [academicYearLabel],
    {
      x: marginX,
      y: by,
      width: bodyWidth,
      fontSize: 13,
      boldOnly: [school.school_name],
    },
  );

  by = doc.y + 30;

  // separator line above the footer, matching the real form
  doc
    .moveTo(marginX, by)
    .lineTo(pageW - marginX, by)
    .lineWidth(0.75)
    .strokeColor("#999999")
    .stroke();

  by += 22;

  /*
    ==========================================
    Footer: School name/seal (left) — Stamp box (center) — Signature (right)
    ==========================================
    */
  const boxW = 90,
    boxH = 100;
  const boxX = pageW / 2 - boxW / 2;
  const boxY = by;

  doc.rect(boxX, boxY, boxW, boxH).lineWidth(1).strokeColor("#333333").stroke();

  const stamp = school.school_stamp_path
    ? path.join(process.cwd(), school.school_stamp_path)
    : null;
  if (stamp && fs.existsSync(stamp)) {
    doc.image(stamp, boxX + 5, boxY + 5, {
      fit: [boxW - 10, boxH - 10],
      align: "center",
      valign: "center",
    });
  }

  // left caption
  doc
    .fontSize(11)
    .font("Times-Italic")
    .fillColor("#111111")
    .text("School Name And Address", marginX, boxY + boxH / 2 - 18, {
      width: boxX - marginX - 20,
    });
  doc.text("(Official Seal)", marginX, doc.y + 2, {
    width: boxX - marginX - 20,
  });

  // right caption + signature
  const rightX = boxX + boxW + 20;
  const rightW = pageW - marginX - rightX;

  const sign = school.principle_signature_path
    ? path.join(process.cwd(), school.principle_signature_path)
    : null;
  if (sign && fs.existsSync(sign)) {
    doc.image(sign, rightX, boxY, { fit: [rightW, 55], align: "left" });
  }

  doc
    .fontSize(11)
    .font("Times-Italic")
    .fillColor("#111111")
    .text("Signature", rightX, boxY + boxH - 34, { width: rightW });
  doc.text("Principal of School", rightX, doc.y + 2, { width: rightW });

  doc.fillColor("#000000");
  doc.end();

  await new Promise((resolve) => stream.on("finish", resolve));

  await repository.updatePdfPath(certificate.certificate_id, outputPath);

try {
    const studentWhatsapp =
      await studentRepository.getStudentWhatsAppData(student.student_id);

    if (studentWhatsapp) {
      await whatsappService.sendCertificate(
        studentWhatsapp,
        certificate.certificate_type,
        outputPath
      );
    } else {
      console.error(
        `[WhatsApp] Certificate alert skipped — student ${student.student_id} ka WhatsApp data nahi mila.`
      );
    }
  } catch (err) {
    console.error(
      "[WhatsApp] sendCertificate failed, continuing without WhatsApp:",
      err.message,
    );
  }
  return {
    filePath: outputPath,
    certificateId: certificate.certificate_id,
    certificateNo: certificate.certificate_no,
  };
};

/**
 * ==========================================
 * Trancefer Certificate
 * ==========================================
 */

/* ================= TRANSFER CERTIFICATE (TC) ================= */
exports.generateTransferCertificatePdf = async (
  studentId,
  generatedBy = "Admin",
  tcData = {},
) => {
  const { student, school } = await service.getBonafideData(studentId);

  const certificate = await service.createCertificate({
    student_id: student.student_id,
    certificate_type: "Transfer Certificate",
    issue_date: new Date().toISOString().split("T")[0],
    generated_by: generatedBy,
    remarks: tcData.remarks || "Transfer Certificate",
        reason: tcData.reason || "",   // ✅ add karo
            index_no: tcData.index_no || "",   // ✅ add karo (lcData mein bhi same)


  });

  const outputPath = path.join(
    process.cwd(),
    "uploads",
    "certificates",
    `${certificate.certificate_no}.pdf`,
  );
  const dir = path.dirname(outputPath);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

  const displayCertificate = {
    certificate_no: certificate.certificate_no,
    issue_date:
      certificate.issue_date ||
      certificate.created_at ||
      new Date().toLocaleDateString(),
  };

  // buildFormData wahi hai jo LC use karta hai — same rows/labels/layout milega
  const data = buildFormData(student, tcData);

  const doc = new PDFDocument({ size: "A4", layout: "portrait", margin: 0 });
  const stream = fs.createWriteStream(outputPath);
  doc.pipe(stream);

  renderLeavingStyleCertificate(doc, {
    school,
    certificate: displayCertificate,
    data,
    type: "TC", // <- yehi single flag title badalta hai: "TRANSFER CERTIFICATE"
  });

  doc.end();
  await new Promise((resolve) => stream.on("finish", resolve));

  await repository.updatePdfPath(certificate.certificate_id, outputPath);

try {
    const studentWhatsapp =
      await studentRepository.getStudentWhatsAppData(student.student_id);

    if (studentWhatsapp) {
      await whatsappService.sendCertificate(
        studentWhatsapp,
        certificate.certificate_type,
        outputPath
      );
    } else {
      console.error(
        `[WhatsApp] Certificate alert skipped — student ${student.student_id} ka WhatsApp data nahi mila.`
      );
    }
  } catch (err) {
    console.error(
      "[WhatsApp] sendCertificate failed, continuing without WhatsApp:",
      err.message,
    );
  }

  return {
    filePath: outputPath,
    certificateId: certificate.certificate_id,
    certificateNo: certificate.certificate_no,
  };
};










/**
 * ==========================================
 * leaving Certificate
 * ==========================================
 */

const INK = "#000000";
const GRAY = "#555555";
const GOLD = "#9b7d2e";
const CREAM_BG = "#FFFDF8";

// If you have a Devanagari-capable font (e.g. NotoSansDevanagari-Regular.ttf),
// drop it in your project and point this path at it. If the file doesn't
// exist, code silently falls back to English-only labels (no crash).
const FONT_PATHS = {
  devanagari: path.join(
    process.cwd(),
    "assets",
    "fonts",
    "NotoSansDevanagari-Regular.ttf",
  ),
};

// Your real logo lives at backend/uploads/school/logo.png — fixed path,
// LC/TC never use school.logo_path from the DB.
const CUSTOM_LOGO_PATH = path.join(
  process.cwd(),
  "uploads",
  "school",
  "logo.png",
);

/* ---------- date -> words helper (for DOB in words) ---------- */
const ONES = [
  "",
  "One",
  "Two",
  "Three",
  "Four",
  "Five",
  "Six",
  "Seven",
  "Eight",
  "Nine",
  "Ten",
  "Eleven",
  "Twelve",
  "Thirteen",
  "Fourteen",
  "Fifteen",
  "Sixteen",
  "Seventeen",
  "Eighteen",
  "Nineteen",
];
const TENS = [
  "",
  "",
  "Twenty",
  "Thirty",
  "Forty",
  "Fifty",
  "Sixty",
  "Seventy",
  "Eighty",
  "Ninety",
];
const ORDINALS = [
  "",
  "First",
  "Second",
  "Third",
  "Fourth",
  "Fifth",
  "Sixth",
  "Seventh",
  "Eighth",
  "Ninth",
  "Tenth",
  "Eleventh",
  "Twelfth",
  "Thirteenth",
  "Fourteenth",
  "Fifteenth",
  "Sixteenth",
  "Seventeenth",
  "Eighteenth",
  "Nineteenth",
  "Twentieth",
  "Twenty-First",
  "Twenty-Second",
  "Twenty-Third",
  "Twenty-Fourth",
  "Twenty-Fifth",
  "Twenty-Sixth",
  "Twenty-Seventh",
  "Twenty-Eighth",
  "Twenty-Ninth",
  "Thirtieth",
  "Thirty-First",
];
const MONTH_NAMES = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

function numberToWords(n) {
  if (n === 0) return "Zero";
  if (n < 20) return ONES[n];
  if (n < 100)
    return TENS[Math.floor(n / 10)] + (n % 10 ? " " + ONES[n % 10] : "");
  if (n < 1000)
    return (
      ONES[Math.floor(n / 100)] +
      " Hundred" +
      (n % 100 ? " " + numberToWords(n % 100) : "")
    );
  if (n < 100000) {
    const th = Math.floor(n / 1000);
    return (
      numberToWords(th) +
      " Thousand" +
      (n % 1000 ? " " + numberToWords(n % 1000) : "")
    );
  }
  return n.toString();
}

function dateToWords(dateObj) {
  if (!dateObj || isNaN(dateObj.getTime())) return "-";
  const day = dateObj.getDate();
  const month = MONTH_NAMES[dateObj.getMonth()];
  const year = dateObj.getFullYear();
  return `${ORDINALS[day]} ${month} ${numberToWords(year)}`;
}

function fmtDDMMYYYY(dateObj) {
  if (!dateObj || isNaN(dateObj.getTime())) return "-";
  const d = String(dateObj.getDate()).padStart(2, "0");
  const m = String(dateObj.getMonth() + 1).padStart(2, "0");
  const y = dateObj.getFullYear();
  return `${d} / ${m} / ${y}`;
}

function toDateSafe(v) {
  if (!v) return null;
  const d = new Date(v);
  return isNaN(d.getTime()) ? null : d;
}

/** "554545454556" -> "5545 4545 4556" (groups of 4, easier to fit + reads official) */
function formatAadhaar(v) {
  const digits = (v || "").toString().replace(/\D/g, "");
  if (!digits) return "-";
  return digits.replace(/(\d{4})(?=\d)/g, "$1 ");
}

/* ---------- low level drawing helpers ---------- */

function drawRow(
  doc,
  {
    x,
    y,
    width,
    labelWidth,
    height,
    label,
    value,
    bold = true,
    split = null,
    valueFontSize = 9.5,
  },
) {
  doc.rect(x, y, width, height).fillColor("#FFFFFF").fill();

  const valueX = x + labelWidth + 10;
  const valueWidth = width - labelWidth - 18;
  const textY = y + height / 2 - 5;
  const textH = height - 6;

  doc
    .fontSize(8.5)
    .font("Helvetica-Bold")
    .fillColor(INK)
    .text(label.toUpperCase(), x + 8, textY, {
      width: labelWidth - 14,
      lineBreak: false,
      ellipsis: true,
    });

  let midX = null;

  if (split) {
    const gap = 8;
    const subLabelW = split.subLabelWidth || 85;
    const minValue2W = 130;
    const value2W = Math.max(minValue2W, valueWidth * 0.3);
    const value1W = Math.max(60, valueWidth - subLabelW - value2W - gap * 2);
    midX = valueX + value1W + gap;
    const value2X = midX + subLabelW + gap;

    doc
      .fontSize(8.5)
      .font("Helvetica-Bold")
      .fillColor(INK)
      .text(split.label2.toUpperCase(), midX + 8, textY, {
        width: subLabelW - 8,
        lineBreak: false,
        ellipsis: true,
      });

    // "|" pipe divider — poori row height ke barabar lambi, thin
    doc
      .moveTo(midX + 8 + subLabelW - 6, y)
      .lineTo(midX + 8 + subLabelW - 6, y + height)
      .lineWidth(0.75)
      .strokeColor("#999999")
      .stroke();

    doc
      .fontSize(valueFontSize)
      .font(bold ? "Helvetica-Bold" : "Helvetica")
      .fillColor(INK)
      .text(split.value2 || "-", value2X, textY, {
        width: value2W - 6,
        height: textH,
        lineBreak: false,
        ellipsis: true,
      });

    doc
      .fontSize(valueFontSize)
      .font(bold ? "Helvetica-Bold" : "Helvetica")
      .fillColor(INK)
      .text(value || "-", valueX, textY, {
        width: value1W - 6,
        height: textH,
        lineBreak: false,
        ellipsis: true,
      });
  } else {
    doc
      .fontSize(valueFontSize)
      .font(bold ? "Helvetica-Bold" : "Helvetica")
      .fillColor(INK)
      .text(value || "-", valueX, textY, {
        width: valueWidth,
        height: textH,
        lineBreak: false,
        ellipsis: true,
      });
  }

  doc.lineWidth(0.75).strokeColor("#333333");
  doc
    .moveTo(x, y)
    .lineTo(x + width, y)
    .stroke();
  doc
    .moveTo(x, y + height)
    .lineTo(x + width, y + height)
    .stroke();
  doc
    .moveTo(x, y)
    .lineTo(x, y + height)
    .stroke();
  doc
    .moveTo(x + width, y)
    .lineTo(x + width, y + height)
    .stroke();
  doc
    .moveTo(x + labelWidth, y)
    .lineTo(x + labelWidth, y + height)
    .stroke();
  if (midX !== null) {
    doc
      .moveTo(midX, y)
      .lineTo(midX, y + height)
      .stroke();
  }
}

/** Small bordered badge box used for "GR No : 565" / "Sr No. : 0150" — explicit x/y so it never overlaps. */
function drawNoBadge(doc, { x, y, width, height, label, value }) {
  doc
    .roundedRect(x, y, width, height, 2) // ← Radius (4)
    .lineWidth(0.75)
    .strokeColor("#333333")
    .stroke();
  doc
    .fontSize(9.5)
    .fillColor(INK)
    .font("Helvetica-Bold")
    .text(label, x + 10, y + height / 2 - 5, {
      continued: true,
      lineBreak: false,
    });
  doc
    .font("Helvetica-Bold")
    .text(value || "-", {
      underline: true,
      width: width - 20 - doc.widthOfString(label),
      lineBreak: false,
      ellipsis: true,
    });
}

/** Renders the "School Leaving Certificate" style form onto a doc. type: "LC" | "TC" */
function renderLeavingStyleCertificate(
  doc,
  { school, certificate, data, type },
) {
  const pageW = PAGE_PORTRAIT.width;
  const pageH = PAGE_PORTRAIT.height;
  const outerM = 18;
  const innerM = 30;

  // cream background + gold/black/gold triple frame (matches reference)
  doc.rect(0, 0, pageW, pageH).fill(CREAM_BG);
  doc
    .rect(outerM, outerM, pageW - outerM * 2, pageH - outerM * 2)
    .lineWidth(2.5)
    .strokeColor(GOLD)
    .stroke();
  doc
    .rect(
      outerM + 5,
      outerM + 5,
      pageW - (outerM + 5) * 2,
      pageH - (outerM + 5) * 2,
    )
    .lineWidth(1.25)
    .strokeColor(INK)
    .stroke();
  doc
    .rect(
      outerM + 9,
      outerM + 9,
      pageW - (outerM + 9) * 2,
      pageH - (outerM + 9) * 2,
    )
    .lineWidth(0.75)
    .strokeColor(GOLD)
    .stroke();
  /**
   * ==========================================
   * PATCH v3 — renderLeavingStyleCertificate() ka POORA header block.
   * Function ke shuru (outerM/innerM frame draw ke baad) se lekar
   * "Title bar" se pehle tak — is poore portion ko is code se replace karo.
   * Sirf School Name + Address hardcoded hain (permanent).
   * Index No. aur UDISE No. school.index_no / school.udise_no se
   * automatic (DB se) aa rahe hain.
   * ==========================================
   */

  const marginX = innerM + outerM;
  const contentW = pageW - marginX * 2;
  let y = outerM + 24;

  // ---- HARDCODED — permanent, kabhi DB se overwrite nahi hoga ----
  const FIXED_SCHOOL_NAME = "ROYAL URDU HIGH SCHOOL\nAMALNER"; // \n = force 2 lines, kabhi 1 line me squeeze nahi hoga
  const FIXED_SCHOOL_ADDRESS =
    "Amalner Tal Amalner Dist Jalgaon Pincode (425401)";

  // ---- header: logo + school name/address (overlap-safe) ----
  // ---- header: logo + school name/address (overlap-safe) ----
  const logoW = 105;
  let logoBottom = y;

  if (fs.existsSync(CUSTOM_LOGO_PATH)) {
    doc.image(CUSTOM_LOGO_PATH, marginX, y, { width: logoW });
    logoBottom = y + logoW; // logo ~square hai, height ≈ width
  }

  // logo left me weight le raha tha isliye title thoda right shift kiya
  const titleShift = logoW * 0.7;
  const titleX = marginX + titleShift;
  const titleW = contentW - titleShift;

  doc
    .fillColor(INK)
    .fontSize(23)
    .font("Helvetica-Bold")
    .text(FIXED_SCHOOL_NAME, titleX, y + 2, {
      width: titleW,
      align: "center",
      lineGap: 2,
    });
  let textBottom = doc.y + 4;

  doc
    .fontSize(9)
    .font("Helvetica-Oblique")
    .fillColor(GRAY)
    .text(FIXED_SCHOOL_ADDRESS, titleX, textBottom, {
      width: titleW,
      align: "center",
    });
  textBottom = doc.y + 12;

  y = Math.max(textBottom, logoBottom + 12);

  y -= 35;
  // subtle box fill
  const boxFill = "#FAFAFA";
  const boxRadius = 3;
  const boxH = 22;

  // ===============================
  // ROW 1 : Index No. + ORIGINAL
  // ===============================

  // Box Width
  const boxW = 170;

  // Dono box ke beech sirf itna gap
  const betweenGap = 8;

  // Dono boxes ko right side le aao
  const totalWidth = boxW * 2 + betweenGap;
  const startX = marginX + contentW - totalWidth;

  // Index Box
  doc.lineWidth(0.25).strokeColor("#DDDDDD");

  doc
    .roundedRect(startX, y, boxW, boxH, boxRadius)
    .fillAndStroke(boxFill, "#DDDDDD");

  // ORIGINAL Box
  doc
    .roundedRect(startX + boxW + betweenGap, y, boxW, boxH, boxRadius)
    .fillAndStroke(boxFill, "#DDDDDD");

  // Text
  doc.fontSize(9).font("Helvetica-Bold").fillColor(INK);

  doc.text(
    `Index No. : ${data.indexNo && data.indexNo !== "-" ? data.indexNo : (school.index_no || "-")}`,
    startX - 30, // left shift
    y + 7,
    {
      width: boxW,
      align: "center",
    },
  );

  doc.text("ORIGINAL", startX + boxW + betweenGap, y + 7, {
    width: boxW,
    align: "center",
  });

  y += boxH + 8;

  // ===============================
  // ROW 2 : UDISE No.
  // ===============================
  doc.lineWidth(0.25).strokeColor("#DDDDDD");
  doc
    .roundedRect(
      startX, // <-- row 1 jaisa hi start, ab left ka khaali space nahi bachega
      y,
      totalWidth, // <-- row 1 ke exact combined width jitna
      boxH,
      boxRadius,
    )
    .fillAndStroke(boxFill, "#DDDDDD");

  const udiseVal = school.udise_no || "-";

  // badge width auto-fit around the number
  doc.fontSize(9.5).font("Helvetica-Bold");
  const udiseTextW = doc.widthOfString(udiseVal);
  const badgePadX = 10;
  const udiseBadgeW = udiseTextW + badgePadX * 2;
  const udiseBadgeH = 15;
  const udiseBadgeX = startX + totalWidth - udiseBadgeW - 8; // right edge se
  const udiseBadgeY = y + (boxH - udiseBadgeH) / 2;

  // label — badge ke bilkul left side, thoda sa padding ke saath
  doc
    .fontSize(9)
    .font("Helvetica-Bold")
    .fillColor(INK)
    .text("UDISE No. :", startX + 8, y + 8, {
      width: udiseBadgeX - startX - 16,
      align: "right",
    });

  doc.lineWidth(0.25).strokeColor("#DDDDDD");
  doc
    .roundedRect(udiseBadgeX, udiseBadgeY, udiseBadgeW, udiseBadgeH, boxRadius)
    .fillAndStroke("#FFFFFF", "#DDDDDD");

  doc
    .fontSize(9.5)
    .font("Helvetica-Bold")
    .fillColor(INK)
    .text(udiseVal, udiseBadgeX, udiseBadgeY + 3.5, {
      width: udiseBadgeW,
      align: "center",
    });

  y += boxH + 8;

  // ---- Title bar ----
  const title =
    type === "TC" ? "TRANSFER CERTIFICATE" : "SCHOOL LEAVING CERTIFICATE";
  doc.rect(marginX, y, contentW, 26).lineWidth(1.25).strokeColor(INK).stroke();
  doc
    .fontSize(15)
    .font("Helvetica-Bold")
    .fillColor(INK)
    .text(title, marginX, y + 7, {
      width: contentW,
      align: "center",
      characterSpacing: 1.5,
    });
  y += 26 + 10;

  // ---- GR No / Sr No — boxed badges, no overlap ----
  const badgeW = 80,
    badgeH = 20;
  drawNoBadge(doc, {
    x: marginX,
    y,
    width: badgeW,
    height: badgeH,
    label: "GR No : ",
    value: data.grNo,
  });
  drawNoBadge(doc, {
    x: marginX + contentW - badgeW,
    y,
    width: badgeW,
    height: badgeH,
    label: "Sr No. : ",
    value: certificate.certificate_no,
  });
  y += badgeH + 10;

  // ---- main detail table ----
  const rowH = 22;
  const labelWidth = 170;

  const rows = [
    {
      label: "PEN Number",
      value: data.pen,
      valueFontSize: 8.5,
      split: {
        label2: "Aadhaar Number",
        value2: data.aadhaar,
        subLabelWidth: 105,
      },
    },
    { label: "Name Of The Pupil In Full", value: data.name },
    { label: "Mother's Name", value: data.motherName },
    { label: "Nationality", value: data.nationality },
    { label: "Mother Tongue", value: data.motherTongue },
    { label: "Religion", value: data.religion },
    { label: "Caste", value: data.caste },
    { label: "Sub Caste", value: data.subCaste },
    { label: "Category", value: data.category },
    { label: "Place Of Birth", value: data.placeOfBirth },
    { label: "Date Of Birth (DD/MM/YYYY)", value: data.dob },
    { label: "Date Of Birth In Words", value: data.dobWords },
    { label: "Last School Attended", value: data.lastSchool },
    {
      label: "Date Of Admission",
      value: data.admissionDate,
      split: {
        label2: "Admission Std.",
        value2: data.admissionStd,
        subLabelWidth: 90,
      },
    },
    {
      label: "Progress In Academic",
      value: data.progress,
      split: { label2: "Conduct", value2: data.conduct, subLabelWidth: 60 },
    },
    {
      label: "Date Of Leaving School",
      value: data.leavingDate,
      split: {
        label2: "Studying In Std",
        value2: data.studyingStd,
        subLabelWidth: 100,
      },
    },
    { label: "Reason Of Leaving", value: data.reason },
  ];

  rows.forEach((r) => {
    drawRow(doc, {
      x: marginX,
      y,
      width: contentW,
      labelWidth,
      height: rowH,
      label: r.label,
      value: r.value,
      split: r.split,
      valueFontSize: r.valueFontSize || 9.5,
    });
    y += rowH;
  });

  y += 16;

  doc
    .moveTo(marginX, y)
    .lineTo(marginX + contentW, y)
    .lineWidth(1)
    .strokeColor(INK)
    .stroke();
  y += 18;

  // ---- footer: Clerk | Seal | Principal ----
  const colW = contentW / 3;
  const sigLineY = y + 46;

  // clerk signature line
  doc
    .moveTo(marginX + 15, sigLineY)
    .lineTo(marginX + colW - 15, sigLineY)
    .lineWidth(0.75)
    .strokeColor("#999999")
    .dash(2, { space: 2 })
    .stroke();
  doc.undash();

  // seal
  const stampCx = marginX + colW + colW / 2;
  const stamp = school.school_stamp_path
    ? path.join(process.cwd(), school.school_stamp_path)
    : null;
  if (stamp && fs.existsSync(stamp)) {
    doc.image(stamp, stampCx - 32, y + 2, {
      fit: [64, 64],
      align: "center",
      valign: "center",
    });
  } else {
    doc
      .circle(stampCx, y + 34, 32)
      .lineWidth(0.75)
      .strokeColor("#999999")
      .dash(2, { space: 2 })
      .stroke();
    doc.undash();
    doc
      .fontSize(7.5)
      .font("Helvetica-Bold")
      .fillColor(GRAY)
      .text("SCHOOL\nROUND\nSTAMP", stampCx - 28, y + 22, {
        width: 56,
        align: "center",
      });
  }

  // principal signature — drawn ABOVE the dashed line, never touching the label below it
  const sign = school.principle_signature_path
    ? path.join(process.cwd(), school.principle_signature_path)
    : null;
  const pSigX1 = marginX + colW * 2 + 15;
  const pSigX2 = marginX + contentW - 15;
  if (sign && fs.existsSync(sign)) {
    const sigW = 70,
      sigH = 30;
    doc.image(
      sign,
      pSigX1 + (pSigX2 - pSigX1) / 2 - sigW / 2,
      sigLineY - sigH - 4,
      { width: sigW, height: sigH },
    );
  }
  doc
    .moveTo(pSigX1, sigLineY)
    .lineTo(pSigX2, sigLineY)
    .lineWidth(0.75)
    .strokeColor("#999999")
    .dash(2, { space: 2 })
    .stroke();
  doc.undash();

  // labels — with Devanagari if a font is available, English-only otherwise
  const hasDevanagari = fs.existsSync(FONT_PATHS.devanagari);
  if (hasDevanagari) doc.registerFont("Devanagari", FONT_PATHS.devanagari);

  const labelY = sigLineY + 10;
  doc
    .fontSize(9)
    .font("Helvetica-Bold")
    .fillColor(INK)
    .text("CLERK" + (hasDevanagari ? " / " : ""), marginX, labelY, {
      width: colW,
      align: "center",
      continued: hasDevanagari,
    });
  if (hasDevanagari) doc.font("Devanagari").text("लिपिक");

  doc
    .fontSize(9)
    .font("Helvetica-Bold")
    .fillColor(INK)
    .text("OFFICIAL SEAL", marginX + colW, labelY, {
      width: colW,
      align: "center",
    });

  doc
    .fontSize(9)
    .font("Helvetica-Bold")
    .fillColor(INK)
    .text(
      "PRINCIPAL" + (hasDevanagari ? " / " : ""),
      marginX + colW * 2,
      labelY,
      { width: colW, align: "center", continued: hasDevanagari },
    );
  if (hasDevanagari) doc.font("Devanagari").text("मुख्याध्यापक");

  y = labelY + 22;
  doc
    .moveTo(marginX, y)
    .lineTo(marginX + contentW, y)
    .lineWidth(0.75)
    .strokeColor("#999999")
    .stroke();
  y += 8;

  doc
    .fontSize(7.5)
    .font("Helvetica")
    .fillColor(GRAY)
    .text(
      `Place : ${school.place || "-"}   |   Date : ${certificate.issue_date}   |   No change in any entry is to be made except by the authority issuing this certificate ` +
        `and infringement of the rule will be punished with rustication.`,
      marginX,
      y,
      { width: contentW, align: "center" },
    );

  doc.fillColor(INK);
}

/* ---------- shared data builder (pulls student/school fields with fallbacks) ----------
   Matches your actual `student` table columns:
   admission_no, gr_no, roll_no, first_name, middle_name, last_name, dob, gender,
   religion, category, caste, nationality, aadhaar, blood_group, mobile, email,
   admission_date, class_id, section_id, photo_path
   + new columns from add_student_certificate_columns.sql:
   pen_number, sub_caste, place_of_birth, mother_tongue, last_school_attended, admission_std
   + joined-in fields (from certificate.repository.js getStudentForCertificate): mother_name, class_name, section_name
*/
function buildFormData(student, extra) {
  const dobDate = toDateSafe(student.dob);
  const admissionDate = toDateSafe(student.admission_date);
  const leavingDate = toDateSafe(extra.leavingDate) || new Date();

  return {
    pen: student.pen_number || "-",
    aadhaar: formatAadhaar(student.aadhaar),
    // FIX: repository already returns the concatenated full name as
    // `student.student_name` (see CONCAT(...) AS student_name in
    // certificate.repository.js). This key must be `name` because
    // the rows[] array below reads `data.name` — that mismatch
    // (data.studentName vs data.name) was why the name printed "-".
    name: (student.student_name || "").trim().replace(/\s+/g, " ") || "-",
    motherName: student.mother_name || "-",
    nationality: student.nationality || "Indian",
    motherTongue: student.mother_tongue || "-",
    religion: student.religion || "-",
    caste: student.caste || "-",
    subCaste: student.sub_caste || "-",
    category: student.category || "-",
    placeOfBirth: student.place_of_birth || "-",
    dob: dobDate ? fmtDDMMYYYY(dobDate) : "-",
    dobWords: dobDate ? dateToWords(dobDate) : "-",
    lastSchool: student.last_school_attended || "-",
    admissionDate: admissionDate ? fmtDDMMYYYY(admissionDate) : "-",
    admissionStd: student.admission_std || "-",
    progress: extra.progress || "Good",
    conduct: extra.character || extra.conduct || "Good",
    leavingDate: fmtDDMMYYYY(leavingDate),
    studyingStd: student.section_name
      ? `${student.class_name} - ${student.section_name}`
      : student.class_name || "-",
    reason: extra.reason || "Parent Request",
        indexNo: extra.index_no || "-",   // ✅ ye line add karo

    grNo: student.gr_no || student.roll_no || "-",
  };
}

/* ================= LEAVING CERTIFICATE (LC) ================= */
exports.generateLeavingCertificatePdf = async (
  studentId,
  generatedBy = "Admin",
  lcData = {},
) => {
  const { student, school } = await service.getBonafideData(studentId);

  const certificate = await service.createCertificate({
    student_id: student.student_id,
    certificate_type: "Leaving Certificate",
    issue_date: new Date().toISOString().split("T")[0],
    generated_by: generatedBy,
    remarks: lcData.remarks || "Leaving Certificate",
        reason: lcData.reason || "",   // ✅ add karo
index_no: lcData.index_no || "",   // ✅


  });

  const outputPath = path.join(
    process.cwd(),
    "uploads",
    "certificates",
    `${certificate.certificate_no}.pdf`,
  );
  const dir = path.dirname(outputPath);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

  // guard against certificate.issue_date being named differently in your DB response
  const displayCertificate = {
    certificate_no: certificate.certificate_no,
    issue_date:
      certificate.issue_date ||
      certificate.created_at ||
      new Date().toLocaleDateString(),
  };

  const data = buildFormData(student, lcData);

  const doc = new PDFDocument({ size: "A4", layout: "portrait", margin: 0 });
  const stream = fs.createWriteStream(outputPath);
  doc.pipe(stream);

  renderLeavingStyleCertificate(doc, {
    school,
    certificate: displayCertificate,
    data,
    type: "LC",
  });

  doc.end();
  await new Promise((resolve) => stream.on("finish", resolve));

  await repository.updatePdfPath(certificate.certificate_id, outputPath);

try {
    const studentWhatsapp =
      await studentRepository.getStudentWhatsAppData(student.student_id);

    if (studentWhatsapp) {
      await whatsappService.sendCertificate(
        studentWhatsapp,
        certificate.certificate_type,
        outputPath
      );
    } else {
      console.error(
        `[WhatsApp] Certificate alert skipped — student ${student.student_id} ka WhatsApp data nahi mila.`
      );
    }
  } catch (err) {
    console.error(
      "[WhatsApp] sendCertificate failed, continuing without WhatsApp:",
      err.message,
    );
  }

  return {
    filePath: outputPath,
    certificateId: certificate.certificate_id,
    certificateNo: certificate.certificate_no,
  };
};

/**
 * ==========================================
 * Character Certificate
 * ==========================================
 */

exports.generateCharacterCertificatePdf = async (
  studentId,
  generatedBy = "Admin",
  characterData = {},
) => {
  const { student, school, academicYear } =
    await service.getBonafideData(studentId);

  const certificate = await service.createCertificate({
    student_id: student.student_id,

    certificate_type: "Character Certificate",

    issue_date: new Date().toISOString().split("T")[0],

    generated_by: generatedBy,

    remarks: characterData.remarks || "Character Certificate",
        reason: characterData.reason || "",   // ✅ add karo
index_no: characterData.index_no || "",   // ✅


  });

  const outputPath = path.join(
    process.cwd(),
    "uploads",
    "certificates",
    `${certificate.certificate_no}.pdf`,
  );

  const yearStart = academicYear?.year_start ?? academicYear?.start_year ?? "";
  const yearEnd = academicYear?.year_end ?? academicYear?.end_year ?? "";
  const academicYearLabel =
    yearStart || yearEnd ? `${yearStart}-${yearEnd}` : "N/A";

  const characterRemark = characterData.character || "GOOD";

  const content = `This is to certify that Mr./Miss ${student.student_name}, Admission No. ${student.admission_no}, Roll No. ${student.roll_no}, was a bonafide student of ${school.school_name}.

The student studied in Class ${student.class_name}, Section ${student.section_name} during the Academic Year ${academicYearLabel}.

During his/her stay in this institution, his/her conduct and character were found to be "${characterRemark}".

This certificate is issued on the request of the student for official purpose.`;

  await exports.generatePdf({
    title: "CHARACTER CERTIFICATE",

    student,

    school,

    certificate: {
      certificate_no: certificate.certificate_no,

      issue_date: new Date().toLocaleDateString(),
    },

    content,

    outputPath,

    highlights: [
      student.student_name,
      student.admission_no,
      student.roll_no,
      school.school_name,
      student.class_name,
      student.section_name,
      academicYearLabel,
      characterRemark,
    ],
  });

  await repository.updatePdfPath(certificate.certificate_id, outputPath);

try {
    const studentWhatsapp =
      await studentRepository.getStudentWhatsAppData(student.student_id);

    if (studentWhatsapp) {
      await whatsappService.sendCertificate(
        studentWhatsapp,
        certificate.certificate_type,
        outputPath
      );
    } else {
      console.error(
        `[WhatsApp] Certificate alert skipped — student ${student.student_id} ka WhatsApp data nahi mila.`
      );
    }
  } catch (err) {
    console.error(
      "[WhatsApp] sendCertificate failed, continuing without WhatsApp:",
      err.message,
    );
  }

  return {
    filePath: outputPath,

    certificateNo: certificate.certificate_no,
  };
};
