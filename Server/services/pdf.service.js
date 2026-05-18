const PDFDocument = require("pdfkit");
const { format } = require("date-fns");

exports.generatePDF = (prescription, res) => {
  const doc = new PDFDocument({ margin: 50 });
  doc.pipe(res);

  doc
    .fontSize(20)
    .font("Helvetica-Bold")
    .text("MedFlow Clinic", { align: "center" });
  doc
    .fontSize(10)
    .font("Helvetica")
    .text("123 Health Street, Islamabad, Pakistan", { align: "center" });
  doc.text("Tel: +92-51-1234567 | Email: clinic@medflow.com", {
    align: "center",
  });
  doc.moveDown();
  doc.moveTo(50, doc.y).lineTo(550, doc.y).stroke();
  doc.moveDown();

  doc.fontSize(12).font("Helvetica-Bold").text("Doctor Information");
  doc.font("Helvetica").fontSize(10);
  doc.text(`Dr. ${prescription.doctorId?.name || "N/A"}`);
  doc.text(
    `Specialization: ${prescription.doctorId?.specialization || "General Physician"}`,
  );
  doc.moveDown();

  doc.fontSize(12).font("Helvetica-Bold").text("Patient Information");
  doc.font("Helvetica").fontSize(10);
  doc.text(`Name: ${prescription.patientId?.name || "N/A"}`);
  doc.text(
    `Age: ${prescription.patientId?.age} | Gender: ${prescription.patientId?.gender}`,
  );
  doc.text(`Date: ${format(new Date(prescription.createdAt), "dd MMM yyyy")}`);
  doc.moveDown();

  doc.moveTo(50, doc.y).lineTo(550, doc.y).stroke();
  doc.moveDown();

  doc.fontSize(12).font("Helvetica-Bold").text("Prescribed Medicines");
  doc.moveDown(0.5);

  const tableTop = doc.y;
  const cols = [50, 200, 300, 400, 480];
  const headers = ["Medicine", "Dosage", "Frequency", "Duration"];
  headers.forEach((h, i) => {
    doc.font("Helvetica-Bold").fontSize(10).text(h, cols[i], tableTop);
  });
  doc.moveDown();

  prescription.medicines.forEach((med, idx) => {
    const y = doc.y;
    if (idx % 2 === 0) {
      doc
        .rect(50, y - 2, 500, 18)
        .fill("#f0f0f0")
        .stroke();
    }
    doc.fillColor("black").font("Helvetica").fontSize(10);
    doc.text(med.name, cols[0], y);
    doc.text(med.dosage, cols[1], y);
    doc.text(med.frequency, cols[2], y);
    doc.text(med.duration, cols[3], y);
    doc.moveDown();
  });

  doc.moveDown();
  if (prescription.instructions) {
    doc.font("Helvetica-Bold").fontSize(11).text("Instructions:");
    doc.font("Helvetica").fontSize(10).text(prescription.instructions);
    doc.moveDown();
  }

  if (prescription.followUpDate) {
    doc
      .font("Helvetica-Bold")
      .fontSize(11)
      .text(`Follow-up Date: ${prescription.followUpDate}`);
    doc.moveDown();
  }

  if (prescription.aiExplanation) {
    doc.moveTo(50, doc.y).lineTo(550, doc.y).stroke();
    doc.moveDown();
    doc
      .font("Helvetica-Bold")
      .fontSize(11)
      .text("Patient Explanation (AI Generated):");
    doc.font("Helvetica").fontSize(10).text(prescription.aiExplanation);
    doc.moveDown();
  }

  doc.moveDown(3);
  doc
    .font("Helvetica-Bold")
    .fontSize(10)
    .text("Doctor's Signature: ________________________", { align: "right" });

  doc.end();
};
