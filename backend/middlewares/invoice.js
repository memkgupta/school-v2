const PDFDocument = require('pdfkit');
const fs = require('fs')
const generateInvoice = (data,path)=>{
 const {student,months,total,invoice_nr} = data;
    const invoice = {
        student: {
            name: student.name,
            admission_no: student.admission_no,
            phone:student.phone
},
        months: months,
        subtotal: total,
       
        invoice_nr: invoice_nr,
    };
const doc = createInvoice(invoice,path)





}
function createInvoice(invoice, path) {
    console.log(invoice)
	let doc = new PDFDocument({ margin: 50 });

    generateHeader(doc);
    generateCustomerInformation(doc, invoice);
	
    generateInvoiceTable(doc, invoice);
    generateFooter(doc);
  
	doc.end();
	doc.pipe(fs.createWriteStream(path));
    return doc;
}
function generateFooter(doc) {
	doc.fontSize(
		10,
	).text(
		'Payment is due within 15 days. Thank you for your business.',
		50,
		780,
		{ align: 'center', width: 500 },
	);
}
function generateHeader(doc) {
	doc
		.fillColor('#444444')
		.fontSize(20)
		.text('ACME Inc.', 110, 57)
		.fontSize(10)
		.text('123 Main Street', 200, 65, { align: 'right' })
		.text('New York, NY, 10025', 200, 80, { align: 'right' })
		.moveDown();
}
function generateCustomerInformation(doc, invoice) {
	const student = invoice.student;
	doc
    .fillColor("#444444")
    .fontSize(20)
    .text("Invoice", 50, 160);

  generateHr(doc, 185);

  const customerInformationTop = 200;

  doc
    .fontSize(10)
    .text("Invoice Number:", 50, customerInformationTop)
    .font("Helvetica-Bold")
    .text(invoice.invoice_nr, 150, customerInformationTop)
    .font("Helvetica")
    .text("Invoice Date:", 50, customerInformationTop + 15)
    .text(formatDate(new Date()), 150, customerInformationTop + 15)
    
   

    .font("Helvetica-Bold")
    .text(invoice.student.name, 300, customerInformationTop)
    .font("Helvetica")
    .text("Admission No. "+invoice.student.admission_no, 300, customerInformationTop + 15)
   
    .moveDown();

 
}
function generateTableRow(doc, y, c1, c2, c3) {
	doc.fontSize(10)
		.text(c1, 50, y)
		.text(c2, 150, y)
		.text(c3, 280, y, { width: 90, align: 'right' })
		
}
function generateInvoiceTable(doc, invoice) {

	let i,
		invoiceTableTop = 330;
 doc.font("Helvetica-Bold");
  generateTableRow(
    doc,
    invoiceTableTop,
    "S.no",
    "month",
    "Amount"
  );
  generateHr(doc, invoiceTableTop + 20);
	for (i = 0; i < invoice.months.length; i++) {
		const month = invoice.months[i];
		const position = invoiceTableTop + (i + 1) * 30;
		generateTableRow(
			doc,
			position,
			i+1,
			month,
			2000,
		);
		generateHr(doc, position + 20);
	}
console.log(invoice.subtotal)
	const subtotalPosition = invoiceTableTop + (i + 1) * 30;
	doc.fontSize(10)
		.text("", 50, subtotalPosition)
		.text("", 150, subtotalPosition)
		.text("SubTotal", 280, subtotalPosition, )
		.text(`${invoice.subtotal}`,300,subtotalPosition,{ width: 90, align: 'right' })
}
function generateHr(doc, y) {
	doc
	  .strokeColor("#aaaaaa")
	  .lineWidth(1)
	  .moveTo(50, y)
	  .lineTo(550, y)
	  .stroke();
  }
  

  
function formatDate(date) {
	const day = date.getDate();
	const month = date.getMonth() + 1;
	const year = date.getFullYear();
  
	return year + "/" + month + "/" + day;
  }
  
  module.exports = {
	createInvoice
  };
module.exports = generateInvoice;