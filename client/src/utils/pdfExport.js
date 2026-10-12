import { PDFDocument, rgb, StandardFonts } from "pdf-lib";

const MARGIN = 50;
const LINE_HEIGHT = 14;
const FONT_SIZE = 10;
const HEADER_FONT_SIZE = 14;
const SECTION_FONT_SIZE = 12;
const NAME_FONT_SIZE = 20;
const MAX_WIDTH = 512; // US Letter width minus margins

export async function generateResumePDF(resumeData, template = "classic", accentColor = "#3B82F6") {
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([612, 792]); // US Letter
  const { width, height } = page.getSize();
  
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  
  const accentRgb = hexToRgb(accentColor);
  const drawAccentLine = (y) => {
    page.drawLine({
      start: { x: MARGIN, y },
      end: { x: width - MARGIN, y },
      thickness: 2,
      color: rgb(accentRgb.r, accentRgb.g, accentRgb.b),
    });
  };

  let y = height - MARGIN;

  const drawText = (text, x, y, options = {}) => {
    const { font: f = font, size = FONT_SIZE, color = rgb(0, 0, 0), maxWidth } = options;
    page.drawText(text, {
      x,
      y,
      font: f,
      size,
      color,
      maxWidth,
      lineHeight: size * 1.3,
    });
  };

  const wrapText = (text, maxWidth, font, size) => {
    if (!text) return [];
    const words = text.split(" ");
    const lines = [];
    let currentLine = "";
    
    for (const word of words) {
      const testLine = currentLine + (currentLine ? " " : "") + word;
      const width = font.widthOfTextAtSize(testLine, size);
      if (width > maxWidth && currentLine) {
        lines.push(currentLine);
        currentLine = word;
      } else {
        currentLine = testLine;
      }
    }
    if (currentLine) lines.push(currentLine);
    return lines;
  };

  const drawWrapped = (text, x, y, options = {}) => {
    const { font: f = font, size = FONT_SIZE, color = rgb(0, 0, 0), maxWidth = MAX_WIDTH } = options;
    const lines = wrapText(text, maxWidth, f, size);
    lines.forEach((line, i) => {
      drawText(line, x, y - i * (size * 1.3), { ...options, font: f, size });
    });
    return y - lines.length * (size * 1.3);
  };

  // Header
  const name = resumeData.personal_info?.full_name || "Your Name";
  drawText(name, MARGIN, y, { font: fontBold, size: NAME_FONT_SIZE, color: rgb(accentRgb.r, accentRgb.g, accentRgb.b) });
  y -= NAME_FONT_SIZE + 4;

  const contactInfo = [
    resumeData.personal_info?.email,
    resumeData.personal_info?.phone,
    resumeData.personal_info?.location,
    resumeData.personal_info?.linkedin,
    resumeData.personal_info?.website,
  ].filter(Boolean).join("  |  ");
  
  drawText(contactInfo, MARGIN, y, { size: FONT_SIZE, color: rgb(0.3, 0.3, 0.3) });
  y -= 20;
  drawAccentLine(y);
  y -= 16;

  // Professional Summary
  if (resumeData.professional_summary) {
    drawText("PROFESSIONAL SUMMARY", MARGIN, y, { font: fontBold, size: SECTION_FONT_SIZE, color: rgb(accentRgb.r, accentRgb.g, accentRgb.b) });
    y -= 18;
    y = drawWrapped(resumeData.professional_summary, MARGIN, y, { maxWidth: MAX_WIDTH }) - 8;
  }

  // Experience
  if (resumeData.experience?.length) {
    drawText("PROFESSIONAL EXPERIENCE", MARGIN, y, { font: fontBold, size: SECTION_FONT_SIZE, color: rgb(accentRgb.r, accentRgb.g, accentRgb.b) });
    y -= 18;
    
    for (const exp of resumeData.experience) {
      if (y < MARGIN + 60) {
        pdfDoc.addPage([612, 792]);
        y = height - MARGIN;
      }
      
      drawText(exp.position, MARGIN, y, { font: fontBold, size: FONT_SIZE + 1 });
      drawText(exp.company, MARGIN + 200, y, { size: FONT_SIZE, color: rgb(0.3, 0.3, 0.3) });
      y -= 14;
      
      const dates = `${exp.start_date || ""} ${exp.is_current ? "– Present" : `– ${exp.end_date || ""}`}`;
      drawText(dates, MARGIN, y, { size: FONT_SIZE - 1, color: rgb(0.4, 0.4, 0.4) });
      y -= 14;
      
      if (exp.description) {
        y = drawWrapped(exp.description, MARGIN + 10, y, { maxWidth: MAX_WIDTH - 10 }) - 4;
      }
      y -= 8;
    }
  }

  // Projects
  if (resumeData.projects?.length) {
    if (y < MARGIN + 60) {
      pdfDoc.addPage([612, 792]);
      y = height - MARGIN;
    }
    
    drawText("PROJECTS", MARGIN, y, { font: fontBold, size: SECTION_FONT_SIZE, color: rgb(accentRgb.r, accentRgb.g, accentRgb.b) });
    y -= 18;
    
    for (const proj of resumeData.projects) {
      drawText(proj.name, MARGIN, y, { font: fontBold, size: FONT_SIZE });
      y -= 14;
      if (proj.description) {
        y = drawWrapped(proj.description, MARGIN + 10, y, { maxWidth: MAX_WIDTH - 10 }) - 4;
      }
      if (proj.type) {
        drawText(proj.type, MARGIN + 10, y, { size: FONT_SIZE - 1, color: rgb(0.4, 0.4, 0.4) });
        y -= 14;
      }
      y -= 6;
    }
  }

  // Education
  if (resumeData.education?.length) {
    if (y < MARGIN + 60) {
      pdfDoc.addPage([612, 792]);
      y = height - MARGIN;
    }
    
    drawText("EDUCATION", MARGIN, y, { font: fontBold, size: SECTION_FONT_SIZE, color: rgb(accentRgb.r, accentRgb.g, accentRgb.b) });
    y -= 18;
    
    for (const edu of resumeData.education) {
      drawText(`${edu.degree || ""} ${edu.field ? `in ${edu.field}` : ""}`.trim(), MARGIN, y, { font: fontBold, size: FONT_SIZE });
      drawText(edu.institution || "", MARGIN + 200, y, { size: FONT_SIZE, color: rgb(0.3, 0.3, 0.3) });
      y -= 14;
      
      if (edu.graduation_date) {
        drawText(edu.graduation_date, MARGIN, y, { size: FONT_SIZE - 1, color: rgb(0.4, 0.4, 0.4) });
        y -= 14;
      }
      if (edu.gpa) {
        drawText(`GPA: ${edu.gpa}`, MARGIN, y, { size: FONT_SIZE - 1 });
        y -= 14;
      }
      y -= 6;
    }
  }

  // Skills
  if (resumeData.skills?.length) {
    if (y < MARGIN + 60) {
      pdfDoc.addPage([612, 792]);
      y = height - MARGIN;
    }
    
    drawText("SKILLS", MARGIN, y, { font: fontBold, size: SECTION_FONT_SIZE, color: rgb(accentRgb.r, accentRgb.g, accentRgb.b) });
    y -= 18;
    
    const skillsText = resumeData.skills.join(", ");
    y = drawWrapped(skillsText, MARGIN, y, { maxWidth: MAX_WIDTH }) - 8;
  }

  return pdfDoc.save();
}

function hexToRgb(hex) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16) / 255,
    g: parseInt(result[2], 16) / 255,
    b: parseInt(result[3], 16) / 255,
  } : { r: 0.39, g: 0.27, b: 0.88 };
}