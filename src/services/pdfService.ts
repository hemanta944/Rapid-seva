// RapidSeva PDF Invoice & Service Receipt Generator
import { jsPDF } from 'jspdf';
import { AssistanceRequest, PaymentRecord } from '../types';

export function generateInvoicePdf(request: AssistanceRequest, payment?: PaymentRecord) {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();

  // Colors
  const orange = [240, 68, 22]; // #F04416
  const charcoal = [36, 36, 36]; // #242424
  const lightGrey = [245, 245, 245];

  // Header Banner
  doc.setFillColor(orange[0], orange[1], orange[2]);
  doc.rect(0, 0, pageWidth, 28, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(22);
  doc.setFont('helvetica', 'bold');
  doc.text('RapidSeva', 14, 18);

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text('Help on Road. With You Soon.', 14, 24);

  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('ROADSIDE ASSISTANCE INVOICE', pageWidth - 14, 18, { align: 'right' });

  // Invoice Details Meta
  doc.setTextColor(charcoal[0], charcoal[1], charcoal[2]);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.text(`Booking ID: ${request.id}`, 14, 38);
  doc.text(`Invoice Date: ${new Date(request.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}`, 14, 44);
  doc.text(`Payment Status: ${request.paymentStatus.toUpperCase()}`, 14, 50);

  const paymentId = payment?.id || request.paymentId || 'PAY-OFFLINE-' + request.id.slice(-4);
  doc.text(`Transaction ID: ${paymentId}`, pageWidth - 14, 38, { align: 'right' });
  doc.text(`Payment Mode: ${payment?.paymentMethod || request.paymentMethod || 'UPI / Online'}`, pageWidth - 14, 44, { align: 'right' });
  doc.text(`GST Registration: 18AAECR9281N1Z5`, pageWidth - 14, 50, { align: 'right' });

  // Divider
  doc.setDrawColor(220, 220, 220);
  doc.line(14, 55, pageWidth - 14, 55);

  // Customer & Provider Information Columns
  // Customer Box
  doc.setFillColor(lightGrey[0], lightGrey[1], lightGrey[2]);
  doc.roundedRect(14, 60, (pageWidth - 34) / 2, 42, 2, 2, 'F');
  
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.text('Customer Details', 20, 68);
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.text(`Name: ${request.customerName}`, 20, 75);
  doc.text(`Phone: ${request.customerPhone}`, 20, 81);
  doc.text(`Vehicle: ${request.vehicleDetails.brand} ${request.vehicleDetails.model}`, 20, 87);
  doc.text(`Registration: ${request.vehicleDetails.registrationNumber}`, 20, 93);

  // Provider Box
  const provX = 14 + (pageWidth - 34) / 2 + 6;
  doc.roundedRect(provX, 60, (pageWidth - 34) / 2, 42, 2, 2, 'F');

  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.text('Assigned Service Provider', provX + 6, 68);
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.text(`Provider: ${request.providerBusinessName || request.providerName || 'Brahmaputra Auto Works'}`, provX + 6, 75);
  doc.text(`Technician: ${request.providerName || 'Certified Technician'}`, provX + 6, 81);
  doc.text(`Contact: ${request.providerPhone || '+91 94351 22334'}`, provX + 6, 87);
  doc.text(`Service Area: GS Road, Dispur & Guwahati NCR`, provX + 6, 93);

  // Incident & Breakdown Details
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.text('Breakdown Location & Service Summary', 14, 112);

  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.text(`Location: ${request.location.address}`, 14, 119);
  doc.text(`Service Category: ${request.serviceCategoryName}`, 14, 125);
  doc.text(`Breakdown Issue: ${request.problemType} — ${request.problemDescription || 'On-spot roadside assistance'}`, 14, 131);

  // Line Items Table
  const tableTop = 142;
  doc.setFillColor(charcoal[0], charcoal[1], charcoal[2]);
  doc.rect(14, tableTop, pageWidth - 28, 9, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.text('SL', 18, tableTop + 6);
  doc.text('DESCRIPTION OF ROAD SERVICE', 30, tableTop + 6);
  doc.text('SAC CODE', 110, tableTop + 6);
  doc.text('QTY', 140, tableTop + 6);
  doc.text('AMOUNT (INR)', pageWidth - 18, tableTop + 6, { align: 'right' });

  // Row 1
  const gross = request.finalPrice || request.estimatedPrice;
  const taxable = Math.round((gross / 1.18) * 100) / 100;
  const gst = Math.round((gross - taxable) * 100) / 100;
  const cgst = Math.round((gst / 2) * 100) / 100;
  const sgst = Math.round((gst / 2) * 100) / 100;

  doc.setTextColor(charcoal[0], charcoal[1], charcoal[2]);
  doc.setFont('helvetica', 'normal');
  doc.text('1.', 18, tableTop + 17);
  doc.text(`${request.serviceCategoryName} Service & On-Site Assistance`, 30, tableTop + 17);
  doc.text('998714', 110, tableTop + 17);
  doc.text('1', 140, tableTop + 17);
  doc.text(`₹ ${taxable.toFixed(2)}`, pageWidth - 18, tableTop + 17, { align: 'right' });

  // Calculation Breakdown
  const calcTop = tableTop + 32;
  doc.setDrawColor(220, 220, 220);
  doc.line(110, calcTop, pageWidth - 14, calcTop);

  doc.text('Taxable Value:', 110, calcTop + 8);
  doc.text(`₹ ${taxable.toFixed(2)}`, pageWidth - 18, calcTop + 8, { align: 'right' });

  doc.text('CGST @ 9%:', 110, calcTop + 15);
  doc.text(`₹ ${cgst.toFixed(2)}`, pageWidth - 18, calcTop + 15, { align: 'right' });

  doc.text('SGST @ 9%:', 110, calcTop + 22);
  doc.text(`₹ ${sgst.toFixed(2)}`, pageWidth - 18, calcTop + 22, { align: 'right' });

  // Grand Total Box
  doc.setFillColor(255, 240, 236); // brand orange-light
  doc.roundedRect(110, calcTop + 26, pageWidth - 110 - 14, 12, 1, 1, 'F');

  doc.setTextColor(orange[0], orange[1], orange[2]);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.text('TOTAL AMOUNT PAID:', 114, calcTop + 34);
  doc.text(`₹ ${gross.toFixed(2)}`, pageWidth - 18, calcTop + 34, { align: 'right' });

  // Statutory Footer & Emergency Notice
  const footerY = 240;
  doc.setFillColor(lightGrey[0], lightGrey[1], lightGrey[2]);
  doc.roundedRect(14, footerY, pageWidth - 28, 38, 2, 2, 'F');

  doc.setTextColor(charcoal[0], charcoal[1], charcoal[2]);
  doc.setFontSize(8);
  doc.setFont('helvetica', 'bold');
  doc.text('IMPORTANT SAFETY & LEGAL NOTICE:', 18, footerY + 8);

  doc.setFont('helvetica', 'normal');
  doc.text(
    'RapidSeva is a roadside assistance technology coordination platform, not an emergency response service.\n' +
    'In case of accident, bodily injury, fire or immediate danger, dial official emergency services first: Assam ERSS (112), Mrityunjoy Ambulance (108), Police (0361-2464557).\n' +
    'This is a computer-generated tax invoice and requires no physical signature. GST applicable under SAC 998714.',
    18,
    footerY + 14
  );

  doc.setFontSize(8);
  doc.setTextColor(120, 120, 120);
  doc.text('RapidSeva Technologies Pvt Ltd (Guwahati Regional Hub) | GS Road, Dispur, Guwahati 781005 | support@rapidseva.com', pageWidth / 2, 288, { align: 'center' });

  // Save the PDF
  doc.save(`RapidSeva-Invoice-${request.id}.pdf`);
}
