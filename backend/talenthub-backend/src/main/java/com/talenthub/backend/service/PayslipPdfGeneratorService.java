package com.talenthub.backend.service;

import com.lowagie.text.*;
import com.lowagie.text.pdf.*;
import com.talenthub.backend.entity.Payslip;
import com.talenthub.backend.entity.Employee;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.awt.Color;
import java.io.ByteArrayOutputStream;
import java.math.BigDecimal;

/**
 * PDF generation service using iText
 * Generates professional payslip documents
 */
@Service
@RequiredArgsConstructor
public class PayslipPdfGeneratorService {

    public byte[] generatePayslipPdf(Payslip payslip, Employee employee) {
        try {
            Document document = new Document(PageSize.A4, 50, 50, 50, 50);
            ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
            PdfWriter.getInstance(document, outputStream);
            document.open();

            // Header
            addHeader(document);

            // Employee and payslip period
            addEmployeeInfo(document, payslip, employee);

            // Salary breakdown
            addEarningsSection(document, payslip);

            // Deductions
            addDeductionsSection(document, payslip);

            // Net salary
            addNetSalarySection(document, payslip);

            // Footer
            addFooter(document);

            document.close();
            return outputStream.toByteArray();
        } catch (DocumentException e) {
            throw new RuntimeException("Failed to generate payslip PDF: " + e.getMessage(), e);
        }
    }

    private void addHeader(Document document) throws DocumentException {
        Paragraph title = new Paragraph("TALENTHUB PAYSLIP", new Font(Font.HELVETICA, 18, Font.BOLD));
        title.setAlignment(Element.ALIGN_CENTER);
        title.setSpacingAfter(20f);
        document.add(title);

        Paragraph line = new Paragraph("_".repeat(80));
        line.setAlignment(Element.ALIGN_CENTER);
        line.setSpacingAfter(20f);
        document.add(line);
    }

    private void addEmployeeInfo(Document document, Payslip payslip, Employee employee) throws DocumentException {
        PdfPTable table = new PdfPTable(2);
        table.setWidthPercentage(100);
        table.setSpacingAfter(20f);

        addTableRow(table, "Employee Name", employee.getFirstName() + " " + employee.getLastName());
        addTableRow(table, "Employee ID", employee.getId().toString());
        addTableRow(table, "Email", employee.getEmail());
        addTableRow(table, "Department", employee.getDepartment() != null ? employee.getDepartment().getName() : "N/A");
        addTableRow(table, "Payslip Period", payslip.getMonthYear());

        document.add(table);
    }

    private void addEarningsSection(Document document, Payslip payslip) throws DocumentException {
        Paragraph header = new Paragraph("EARNINGS", new Font(Font.HELVETICA, 12, Font.BOLD));
        header.setSpacingBefore(10f);
        header.setSpacingAfter(10f);
        document.add(header);

        PdfPTable table = new PdfPTable(2);
        table.setWidthPercentage(100);
        table.setSpacingAfter(20f);
        table.setWidths(new float[]{3, 1});

        addMoneyRow(table, "Base Salary", payslip.getBaseSalary());

        document.add(table);
    }

    private void addDeductionsSection(Document document, Payslip payslip) throws DocumentException {
        Paragraph header = new Paragraph("DEDUCTIONS", new Font(Font.HELVETICA, 12, Font.BOLD));
        header.setSpacingBefore(10f);
        header.setSpacingAfter(10f);
        document.add(header);

        PdfPTable table = new PdfPTable(2);
        table.setWidthPercentage(100);
        table.setSpacingAfter(20f);
        table.setWidths(new float[]{3, 1});

        addMoneyRow(table, "PF (Provident Fund)", payslip.getPfDeduction());
        addMoneyRow(table, "ESI (Employee State Insurance)", payslip.getEsiDeduction());
        addMoneyRow(table, "Total Deductions", payslip.getTotalDeductions());

        document.add(table);
    }

    private void addNetSalarySection(Document document, Payslip payslip) throws DocumentException {
        PdfPTable table = new PdfPTable(2);
        table.setWidthPercentage(100);
        table.setSpacingAfter(20f);
        table.setWidths(new float[]{3, 1});

        Font labelFont = new Font(Font.HELVETICA, 12, Font.BOLD, Color.WHITE);
        PdfPCell labelCell = new PdfPCell(new Paragraph("NET SALARY", labelFont));
        labelCell.setPadding(10f);
        labelCell.setBackgroundColor(new Color(0, 102, 204));
        table.addCell(labelCell);

        Font valueFont = new Font(Font.HELVETICA, 12, Font.BOLD, Color.WHITE);
        PdfPCell valueCell = new PdfPCell(new Paragraph(
                formatCurrency(payslip.getNetSalary()),
                valueFont
        ));
        valueCell.setPadding(10f);
        valueCell.setBackgroundColor(new Color(0, 102, 204));
        valueCell.setHorizontalAlignment(Element.ALIGN_RIGHT);
        table.addCell(valueCell);

        document.add(table);
    }

    private void addFooter(Document document) throws DocumentException {
        document.add(new Paragraph("\n"));
        Paragraph footer = new Paragraph("This is an electronically generated payslip and does not require signature.",
                new Font(Font.HELVETICA, 8, Font.ITALIC));
        footer.setAlignment(Element.ALIGN_CENTER);
        footer.setSpacingBefore(10f);
        document.add(footer);
    }

    private void addTableRow(PdfPTable table, String label, String value) {
        PdfPCell labelCell = new PdfPCell(new Paragraph(label, new Font(Font.HELVETICA, 10, Font.BOLD)));
        labelCell.setPadding(5f);
        labelCell.setBackgroundColor(new Color(240, 240, 240));
        table.addCell(labelCell);

        PdfPCell valueCell = new PdfPCell(new Paragraph(value, new Font(Font.HELVETICA, 10)));
        valueCell.setPadding(5f);
        table.addCell(valueCell);
    }

    private void addMoneyRow(PdfPTable table, String label, BigDecimal amount) {
        PdfPCell labelCell = new PdfPCell(new Paragraph(label, new Font(Font.HELVETICA, 10)));
        labelCell.setPadding(5f);
        table.addCell(labelCell);

        PdfPCell valueCell = new PdfPCell(new Paragraph(formatCurrency(amount), new Font(Font.HELVETICA, 10)));
        valueCell.setPadding(5f);
        valueCell.setHorizontalAlignment(Element.ALIGN_RIGHT);
        table.addCell(valueCell);
    }

    private String formatCurrency(BigDecimal amount) {
        return String.format("₹ %.2f", amount);
    }
}
