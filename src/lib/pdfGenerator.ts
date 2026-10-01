import { PDFDocument, rgb, StandardFonts } from "pdf-lib";
import { LegalDocumentArtifact, LandRecord, PropertyInput } from "@/types/landnyaya";

/**
 * Sanitizes input text to ensure compatibility with StandardFonts in pdf-lib (WinAnsi encoding).
 * Replaces fancy quotes, symbols, bullets, currency, checkmarks, etc. with safe printable ASCII equivalents.
 */
function sanitizeForWinAnsi(text: string): string {
  if (!text) return "";
  return text
    .replace(/[\u2018\u2019]/g, "'")
    .replace(/[\u201C\u201D]/g, '"')
    .replace(/[\u2013\u2014]/g, "-")
    .replace(/\u2022/g, "*") // bullet
    .replace(/\u20B9/g, "Rs. ") // Indian Rupee symbol
    .replace(/\u2713|\u2714/g, "[X]") // checkmark
    .replace(/\u2716|\u2718/g, "[x]") // cross mark
    .replace(/\u25A0|\u25A1|\u25AA|\u25CF/g, "-") // boxes/dots
    .replace(/[^\x20-\x7E\n\r\t]/g, " "); // Replace any non-ASCII character with space
}

/**
 * Helper to wrap text cleanly for pdf-lib within a given width
 */
function wrapText(text: string, font: any, fontSize: number, maxWidth: number): string[] {
  const lines: string[] = [];
  const safeText = sanitizeForWinAnsi(text);
  const rawParagraphs = safeText.split("\n");

  for (const paragraph of rawParagraphs) {
    if (paragraph.trim() === "") {
      lines.push("");
      continue;
    }

    const words = paragraph.split(" ");
    let currentLine = words[0] || "";

    for (let i = 1; i < words.length; i++) {
      const word = words[i];
      if (!word) continue;
      const testLine = `${currentLine} ${word}`;
      const width = font.widthOfTextAtSize(testLine, fontSize);

      if (width <= maxWidth) {
        currentLine = testLine;
      } else {
        lines.push(currentLine);
        currentLine = word;
      }
    }
    if (currentLine) {
      lines.push(currentLine);
    }
  }

  return lines;
}

/**
 * Draw official header banner on a page
 */
function drawOfficialHeader(
  page: any,
  width: number,
  height: number,
  fonts: { timesBold: any; helvetica: any; helveticaBold: any },
  docCategory: string,
  refNumber: string
) {
  const margin = 40;
  const contentWidth = width - margin * 2;
  const topY = height - 36;

  // Navy / Slate Header Box
  page.drawRectangle({
    x: margin,
    y: topY - 22,
    width: contentWidth,
    height: 22,
    color: rgb(0.06, 0.09, 0.16), // Slate-950
  });

  // Header Title
  page.drawText("LANDNYAYA AP  *  GOVERNMENT OF ANDHRA PRADESH REVENUE DRAFT", {
    x: margin + 10,
    y: topY - 15,
    size: 8,
    font: fonts.helveticaBold,
    color: rgb(0.95, 0.95, 0.95),
  });

  // Ref Number Right
  const cleanRef = sanitizeForWinAnsi(`REF: ${refNumber}`);
  const refWidth = fonts.helvetica.widthOfTextAtSize(cleanRef, 7.5);
  page.drawText(cleanRef, {
    x: width - margin - refWidth - 10,
    y: topY - 15,
    size: 7.5,
    font: fonts.helvetica,
    color: rgb(0.3, 0.85, 0.6), // Emerald
  });
}

/**
 * Draw official footer on a page
 */
function drawOfficialFooter(
  page: any,
  width: number,
  height: number,
  fonts: { timesItalic: any; helvetica: any },
  pageNum: number,
  totalPages: number
) {
  const margin = 40;
  const footerY = 28;

  // Divider Line
  page.drawLine({
    start: { x: margin, y: footerY + 12 },
    end: { x: width - margin, y: footerY + 12 },
    thickness: 0.75,
    color: rgb(0.8, 0.85, 0.9),
  });

  // Left Disclaimer
  page.drawText(
    "LandNyaya AP - Andhra Pradesh Land Law Intelligence System - Statutory Draft Ready for Filing",
    {
      x: margin,
      y: footerY,
      size: 7,
      font: fonts.timesItalic,
      color: rgb(0.4, 0.45, 0.5),
    }
  );

  // Right Page Count
  const pageStr = `Page ${pageNum} of ${totalPages}`;
  const pWidth = fonts.helvetica.widthOfTextAtSize(pageStr, 7);
  page.drawText(pageStr, {
    x: width - margin - pWidth,
    y: footerY,
    size: 7,
    font: fonts.helvetica,
    color: rgb(0.4, 0.45, 0.5),
  });
}

/**
 * Generate highly official, pre-filled Legal PDF using pdf-lib
 */
export async function generateOfficialLegalPdf(
  artifact: LegalDocumentArtifact,
  surveyNumber: string,
  landRecord?: LandRecord,
  propertyInput?: PropertyInput
): Promise<Uint8Array> {
  const pdfDoc = await PDFDocument.create();

  // Standard Legal/Official Fonts
  const times = await pdfDoc.embedFont(StandardFonts.TimesRoman);
  const timesBold = await pdfDoc.embedFont(StandardFonts.TimesRomanBold);
  const timesItalic = await pdfDoc.embedFont(StandardFonts.TimesRomanItalic);
  const helvetica = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const helveticaBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

  const fonts = { times, timesBold, timesItalic, helvetica, helveticaBold };

  const pageWidth = 595.28; // A4 Width
  const pageHeight = 841.89; // A4 Height
  const margin = 42;
  const contentWidth = pageWidth - margin * 2;

  let page = pdfDoc.addPage([pageWidth, pageHeight]);
  let y = pageHeight - 70;

  const refNumber = artifact.referenceNumber || `LN-AP/${surveyNumber.replace(/[^a-zA-Z0-9]/g, "")}`;

  // 1. Official Header
  drawOfficialHeader(page, pageWidth, pageHeight, fonts, artifact.id, refNumber);

  // 2. Court Stamp / Revenue Stamp Placeholder Box (Top-Right)
  const stampBoxWidth = 100;
  const stampBoxHeight = 36;
  page.drawRectangle({
    x: pageWidth - margin - stampBoxWidth,
    y: y - stampBoxHeight + 10,
    width: stampBoxWidth,
    height: stampBoxHeight,
    borderColor: rgb(0.65, 0.7, 0.75),
    borderWidth: 0.75,
    color: rgb(0.98, 0.98, 0.99),
  });
  page.drawText("AFFIX REVENUE /", {
    x: pageWidth - margin - stampBoxWidth + 8,
    y: y - 8,
    size: 6.5,
    font: helveticaBold,
    color: rgb(0.4, 0.45, 0.5),
  });
  page.drawText("COURT FEE STAMP", {
    x: pageWidth - margin - stampBoxWidth + 8,
    y: y - 17,
    size: 6.5,
    font: helveticaBold,
    color: rgb(0.4, 0.45, 0.5),
  });
  page.drawText("RS. 10/- TO RS. 20/-", {
    x: pageWidth - margin - stampBoxWidth + 8,
    y: y - 25,
    size: 6,
    font: helvetica,
    color: rgb(0.5, 0.55, 0.6),
  });

  // 3. Document Title Box (Centered, with room for Stamp)
  const titleMaxWidth = contentWidth - stampBoxWidth - 10;
  const titleLines = wrapText(artifact.title, timesBold, 10.5, titleMaxWidth);
  for (const line of titleLines) {
    page.drawText(line, {
      x: margin,
      y,
      size: 10.5,
      font: timesBold,
      color: rgb(0.06, 0.1, 0.2),
    });
    y -= 13;
  }

  // 4. Subtitle / Act Citation
  if (artifact.subtitle) {
    const subLines = wrapText(artifact.subtitle, timesItalic, 8.5, titleMaxWidth);
    for (const line of subLines) {
      page.drawText(line, {
        x: margin,
        y,
        size: 8.5,
        font: timesItalic,
        color: rgb(0.3, 0.35, 0.45),
      });
      y -= 11;
    }
  }

  y = Math.min(y, pageHeight - 110);
  y -= 6;

  // 5. Pre-filled Metadata Schedule Box (2-Column Property Grid)
  const metaBoxHeight = 52;
  page.drawRectangle({
    x: margin,
    y: y - metaBoxHeight,
    width: contentWidth,
    height: metaBoxHeight,
    color: rgb(0.96, 0.97, 0.99),
    borderColor: rgb(0.75, 0.82, 0.9),
    borderWidth: 0.8,
  });

  const col1X = margin + 10;
  const col2X = margin + contentWidth / 2 + 10;
  const row1Y = y - 12;
  const row2Y = y - 24;
  const row3Y = y - 36;
  const row4Y = y - 48;

  const mandalName = landRecord?.mandal || propertyInput?.mandal || propertyInput?.taluka || "Jurisdiction Mandal";
  const distName = landRecord?.district || propertyInput?.district || "Andhra Pradesh";
  const villageName = landRecord?.village || propertyInput?.village || "Revenue Village";
  const extentStr = landRecord?.totalExtent || "Specified Extent";
  const khataStr = landRecord?.khataNumber ? `Khata: ${landRecord.khataNumber}` : "Khata Pending";

  page.drawText(`Date of Draft: ${sanitizeForWinAnsi(artifact.dateGenerated)}`, {
    x: col1X,
    y: row1Y,
    size: 7.5,
    font: helveticaBold,
    color: rgb(0.12, 0.18, 0.28),
  });

  page.drawText(`Survey / Sub-Div No: ${sanitizeForWinAnsi(surveyNumber)}`, {
    x: col2X,
    y: row1Y,
    size: 7.5,
    font: helveticaBold,
    color: rgb(0.12, 0.18, 0.28),
  });

  page.drawText(`Village / Mandal: ${sanitizeForWinAnsi(`${villageName}, ${mandalName}`)}`, {
    x: col1X,
    y: row2Y,
    size: 7.5,
    font: helvetica,
    color: rgb(0.2, 0.25, 0.35),
  });

  page.drawText(`District: ${sanitizeForWinAnsi(distName)}`, {
    x: col2X,
    y: row2Y,
    size: 7.5,
    font: helvetica,
    color: rgb(0.2, 0.25, 0.35),
  });

  page.drawText(`Extent & Khata: ${sanitizeForWinAnsi(`${extentStr} | ${khataStr}`)}`, {
    x: col1X,
    y: row3Y,
    size: 7,
    font: helvetica,
    color: rgb(0.3, 0.35, 0.45),
  });

  page.drawText(`Mode of Delivery: Inward / Regd Post AD (RPAD)`, {
    x: col2X,
    y: row3Y,
    size: 7,
    font: helvetica,
    color: rgb(0.3, 0.35, 0.45),
  });

  page.drawText(`Statutory Act: ${sanitizeForWinAnsi(artifact.statutoryAct.substring(0, 52))}`, {
    x: col1X,
    y: row4Y,
    size: 6.8,
    font: helvetica,
    color: rgb(0.4, 0.45, 0.5),
  });

  page.drawText(`State Portal: AP MeeBhoomi / AP Seva / CCLA AP`, {
    x: col2X,
    y: row4Y,
    size: 6.8,
    font: helvetica,
    color: rgb(0.4, 0.45, 0.5),
  });

  y -= metaBoxHeight + 14;

  // 6. Main Body Content (Pre-filled text processing)
  const safeContent = sanitizeForWinAnsi(artifact.content);
  const rawBodyLines = safeContent.split("\n");

  for (let i = 0; i < rawBodyLines.length; i++) {
    const rawLine = rawBodyLines[i];

    // Check page overflow
    if (y < 75) {
      page = pdfDoc.addPage([pageWidth, pageHeight]);
      drawOfficialHeader(page, pageWidth, pageHeight, fonts, artifact.id, refNumber);
      y = pageHeight - 65;
    }

    if (!rawLine || rawLine.trim() === "") {
      y -= 6;
      continue;
    }

    const isMajorHeading =
      rawLine.startsWith("BEFORE THE") ||
      rawLine.startsWith("TO,") ||
      rawLine.startsWith("THE TAHSILDAR") ||
      rawLine.startsWith("1. PARTICULARS") ||
      rawLine.startsWith("2. DETAILS") ||
      rawLine.startsWith("3. MODE") ||
      rawLine.startsWith("4. STATUTORY") ||
      rawLine.startsWith("PRAYER:") ||
      rawLine.startsWith("VERIFICATION:") ||
      rawLine.startsWith("LEGAL NOTICE") ||
      rawLine.startsWith("FORM 'A'") ||
      rawLine.startsWith("FORM - 6A") ||
      rawLine.startsWith("STATUTORY PETITION") ||
      rawLine.startsWith("PLEASE TAKE FURTHER NOTICE");

    if (isMajorHeading) {
      y -= 3;
      page.drawText(rawLine, {
        x: margin,
        y,
        size: 9,
        font: timesBold,
        color: rgb(0.05, 0.08, 0.18),
      });
      y -= 12;
    } else {
      const wrapped = wrapText(rawLine, times, 8.8, contentWidth);
      for (const wrappedLine of wrapped) {
        if (y < 75) {
          page = pdfDoc.addPage([pageWidth, pageHeight]);
          drawOfficialHeader(page, pageWidth, pageHeight, fonts, artifact.id, refNumber);
          y = pageHeight - 65;
        }

        page.drawText(wrappedLine, {
          x: margin,
          y,
          size: 8.8,
          font: times,
          color: rgb(0.1, 0.12, 0.16),
        });
        y -= 11;
      }
    }
  }

  // 7. Mandatory Enclosures / Attachments Checklist Box
  if (artifact.requiredAttachments && artifact.requiredAttachments.length > 0) {
    const boxHeight = 18 + artifact.requiredAttachments.length * 12;
    if (y < boxHeight + 80) {
      page = pdfDoc.addPage([pageWidth, pageHeight]);
      drawOfficialHeader(page, pageWidth, pageHeight, fonts, artifact.id, refNumber);
      y = pageHeight - 65;
    }

    y -= 8;

    page.drawRectangle({
      x: margin,
      y: y - boxHeight,
      width: contentWidth,
      height: boxHeight,
      color: rgb(0.97, 0.99, 0.97),
      borderColor: rgb(0.72, 0.85, 0.76),
      borderWidth: 0.75,
    });

    page.drawText("MANDATORY STATUTORY ENCLOSURES (ATTACHMENTS):", {
      x: margin + 10,
      y: y - 11,
      size: 7.5,
      font: helveticaBold,
      color: rgb(0.05, 0.35, 0.15),
    });

    let attY = y - 22;
    artifact.requiredAttachments.forEach((att) => {
      const safeAtt = sanitizeForWinAnsi(att);
      page.drawText(`[X]  ${safeAtt}`, {
        x: margin + 12,
        y: attY,
        size: 7.2,
        font: helvetica,
        color: rgb(0.15, 0.25, 0.2),
      });
      attY -= 11;
    });

    y -= boxHeight + 10;
  }

  // 8. Official Signature & Counsel Block
  const sigBoxHeight = 55;
  if (y < sigBoxHeight + 70) {
    page = pdfDoc.addPage([pageWidth, pageHeight]);
    drawOfficialHeader(page, pageWidth, pageHeight, fonts, artifact.id, refNumber);
    y = pageHeight - 65;
  }

  y -= 8;
  page.drawLine({
    start: { x: margin, y },
    end: { x: margin + 180, y },
    thickness: 0.75,
    color: rgb(0.6, 0.65, 0.7),
  });

  page.drawLine({
    start: { x: pageWidth - margin - 180, y },
    end: { x: pageWidth - margin, y },
    thickness: 0.75,
    color: rgb(0.6, 0.65, 0.7),
  });

  page.drawText("SIGNATURE OF APPLICANT / PETITIONER", {
    x: margin,
    y: y - 10,
    size: 7.5,
    font: helveticaBold,
    color: rgb(0.15, 0.2, 0.28),
  });

  page.drawText(`Name: ${sanitizeForWinAnsi(propertyInput?.applicantName || landRecord?.ownerName || "Applicant")}`, {
    x: margin,
    y: y - 20,
    size: 7.2,
    font: helvetica,
    color: rgb(0.25, 0.3, 0.4),
  });

  page.drawText("ADVOCATE / AUTHORIZED COUNSEL", {
    x: pageWidth - margin - 180,
    y: y - 10,
    size: 7.5,
    font: helveticaBold,
    color: rgb(0.15, 0.2, 0.28),
  });

  page.drawText("Enrolment No: AP/_______/202X", {
    x: pageWidth - margin - 180,
    y: y - 20,
    size: 7.2,
    font: helvetica,
    color: rgb(0.25, 0.3, 0.4),
  });

  page.drawText(`Place: ${sanitizeForWinAnsi(distName)}, Andhra Pradesh`, {
    x: margin,
    y: y - 32,
    size: 7,
    font: timesItalic,
    color: rgb(0.45, 0.5, 0.55),
  });

  page.drawText(`Date: ${sanitizeForWinAnsi(artifact.dateGenerated)}`, {
    x: pageWidth - margin - 180,
    y: y - 32,
    size: 7,
    font: timesItalic,
    color: rgb(0.45, 0.5, 0.55),
  });

  // Draw Footers on All Pages
  const pages = pdfDoc.getPages();
  const totalPages = pages.length;

  for (let i = 0; i < totalPages; i++) {
    drawOfficialFooter(pages[i], pageWidth, pageHeight, fonts, i + 1, totalPages);
  }

  return await pdfDoc.save();
}

/**
 * Trigger instant client-side download of the official generated PDF
 */
export async function generateAndDownloadPdf(
  artifact: LegalDocumentArtifact,
  propertySurveyNo: string,
  landRecord?: LandRecord,
  propertyInput?: PropertyInput
) {
  try {
    const pdfBytes = await generateOfficialLegalPdf(
      artifact,
      propertySurveyNo,
      landRecord,
      propertyInput
    );

    const blob = new Blob([pdfBytes as any], { type: "application/pdf" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `LandNyaya_${artifact.id}_Sy${propertySurveyNo.replace(/[^a-zA-Z0-9]/g, "_")}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  } catch (error) {
    console.error("PDF generation failed:", error);
  }
}
