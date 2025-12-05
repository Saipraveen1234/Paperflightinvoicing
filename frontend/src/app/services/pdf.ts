import { Injectable } from '@angular/core';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Invoice } from './invoice';

@Injectable({
    providedIn: 'root'
})
export class PdfService {

    constructor() { }

    previewInvoicePdf(invoice: Invoice) {
        const doc = new jsPDF();

        // Load Logo
        const logoUrl = '/logo.png';
        const img = new Image();
        img.src = logoUrl;

        img.onload = () => {
            // Add Logo (Top Right)
            doc.addImage(img, 'PNG', 150, 10, 40, 20); // x, y, w, h
            this.renderContent(doc, invoice);
        };

        img.onerror = () => {
            console.warn('Logo not found, generating PDF without logo');
            this.renderContent(doc, invoice);
        };
    }

    private renderContent(doc: jsPDF, invoice: Invoice) {
        // ... (content rendering logic remains same) ...
        // Title
        doc.setFontSize(24);
        doc.setFont('helvetica', 'bold');
        doc.text('INVOICE', 15, 20);

        // Reset Font
        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');

        // Left Column (Date, Invoice No, Bill To)
        let yPos = 40;

        doc.text(`Date: ${this.formatDate(invoice.date)}`, 15, yPos);
        yPos += 5;
        doc.line(15, yPos, 80, yPos); // Underline
        yPos += 10;

        doc.text(`No. Invoice : ${invoice.invoiceNumber.replace('INV-', '')}`, 15, yPos);
        yPos += 5;
        doc.line(15, yPos, 80, yPos); // Underline
        yPos += 15;

        doc.text(`Bill to: ${invoice.clientName}`, 15, yPos);
        yPos += 10;

        // Address (Multi-line)
        const addressLines = doc.splitTextToSize(`Address: ${invoice.clientAddress}`, 80);
        doc.text(addressLines, 15, yPos);

        // Right Column (Company Details)
        yPos = 40;
        const rightColX = 120;
        const details = invoice.companyDetails;

        doc.setFont('helvetica', 'bold');

        doc.text(`Payment Method: Bank Transfer`, rightColX, yPos);
        yPos += 6;
        doc.text(`Account number: ${details.accountNumber}`, rightColX, yPos);
        yPos += 6;
        doc.text(`Account name: ${details.accountName}`, rightColX, yPos);
        yPos += 6;
        doc.text(`IFSC Code: ${details.ifscCode}`, rightColX, yPos);
        yPos += 6;
        doc.text(`Branch: ${details.branch}`, rightColX, yPos);
        yPos += 6;
        if (details.pan) {
            doc.text(`PAN Card: ${details.pan}`, rightColX, yPos);
        }


        // Table
        yPos = 110; // Start table below address

        autoTable(doc, {
            startY: yPos,
            head: [['S.No', 'Item Description', 'Price in Rs']],
            body: invoice.items.map((item, index) => [
                index + 1,
                item.description,
                'Full Value',
                `${item.price.toLocaleString()}/-`
            ]),
            theme: 'plain',
            styles: {
                lineColor: [0, 0, 0],
                lineWidth: 0.1,
                textColor: [0, 0, 0],
                fontSize: 10
            },
            headStyles: {
                fillColor: [240, 240, 240], // Light gray header
                fontStyle: 'bold',
                halign: 'center'
            },
            columnStyles: {
                0: { halign: 'center', cellWidth: 20 },
                1: { cellWidth: 80 },
                2: { halign: 'center', cellWidth: 40 },
                3: { halign: 'right', cellWidth: 40 }
            },
            margin: { left: 15, right: 15 }
        });

        // Total Box
        const finalY = (doc as any).lastAutoTable.finalY + 20;

        // "Amount to be transferred" box
        doc.rect(15, finalY, 110, 10);
        doc.setFont('helvetica', 'bold');
        doc.text('Amount to be transferred', 70, finalY + 7, { align: 'center' });

        // "Total Rs" box
        doc.rect(135, finalY, 60, 10); // Aligned right
        doc.text(`Total Rs: ${invoice.totalAmount.toLocaleString()}/-`, 140, finalY + 7);

        // Footer / Signature
        const footerY = 270;

        // Contact Info
        doc.setFontSize(9);
        doc.setFont('helvetica', 'normal');
        doc.text('+91-9848423737', 20, footerY);
        doc.text('hello@paperflightstudios.com', 20, footerY + 5);
        doc.text('www.paperflightstudios.com', 20, footerY + 10);

        // Signature
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(14);
        doc.text('', 160, footerY - 5, { align: 'center' });
        doc.setFontSize(10);
        doc.text('Vibhu Yadati', 160, footerY + 5, { align: 'center' });
        doc.line(140, footerY, 180, footerY); // Line under signature

        // Preview (Open in new tab)
        window.open(doc.output('bloburl'), '_blank');
    }

    private formatDate(dateStr: string): string {
        const date = new Date(dateStr);
        return `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getFullYear()}`;
    }
}
