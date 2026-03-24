package com.talenthub.backend.service;

import com.lowagie.text.Document;
import com.lowagie.text.Font;
import com.lowagie.text.FontFactory;
import com.lowagie.text.Paragraph;
import com.lowagie.text.pdf.PdfWriter;
import com.talenthub.backend.entity.Employee;
import com.talenthub.backend.entity.Salary;
import com.talenthub.backend.repository.SalaryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.time.LocalDate;
import java.util.Optional;

@Service
public class PayrollService {

    @Autowired
    private SalaryRepository salaryRepository;

    // 1. Calculate and save monthly salary
    public Salary calculateSalary(Employee employee, int month, int year) {
        
        Optional<Salary> existing = salaryRepository.findByEmployeeAndMonthAndYear(employee, month, year);
        if (existing.isPresent()) {
            return existing.get();
        }

        double basic = employee.getBasicSalary() != null ? employee.getBasicSalary() : 0.0;
        double pf = basic * 0.12; // 12% PF
        double esi = basic * 0.01; // 1% ESI
        double net = basic - pf - esi;

        Salary salary = new Salary(employee, month, year, basic);
        salary.setPfDeduction(pf);
        salary.setEsiDeduction(esi);
        salary.setNetSalary(net);
        salary.setPayDate(LocalDate.now());

        return salaryRepository.save(salary);
    }

    // 2. Generate PDF Payslip
    public ByteArrayInputStream generatePayslipPdf(Salary salary) {
        Document document = new Document();
        ByteArrayOutputStream out = new ByteArrayOutputStream();

        try {
            PdfWriter.getInstance(document, out);
            document.open();

            // Header
            Font headerFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 18);
            Paragraph header = new Paragraph("TALENT HUB - MONTHLY PAYSLIP", headerFont);
            header.setAlignment(Paragraph.ALIGN_CENTER);
            document.add(header);
            document.add(new Paragraph(" ")); // Spacer

            // Employee Details
            document.add(new Paragraph("Employee Name: " + salary.getEmployee().getFirstName() + " " + salary.getEmployee().getLastName()));
            document.add(new Paragraph("Month/Year: " + salary.getMonth() + "/" + salary.getYear()));
            document.add(new Paragraph("Department: " + (salary.getEmployee().getDepartment() != null ? salary.getEmployee().getDepartment().getName() : "N/A")));
            document.add(new Paragraph("------------------------------------------------------------------"));

            // Salary Breakdown
            document.add(new Paragraph("Basic Salary:  Rs. " + salary.getBasicSalary()));
            document.add(new Paragraph("PF Deduction (12%):  - Rs. " + salary.getPfDeduction()));
            document.add(new Paragraph("ESI Deduction (1%):  - Rs. " + salary.getEsiDeduction()));
            document.add(new Paragraph("------------------------------------------------------------------"));
            
            Font netFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 14);
            document.add(new Paragraph("NET TAKE-HOME SALARY: Rs. " + salary.getNetSalary(), netFont));
            
            document.add(new Paragraph(" "));
            document.add(new Paragraph("Generated on: " + salary.getPayDate()));
            document.add(new Paragraph("Note: This is a computer-generated payslip and does not require a signature."));

            document.close();
        } catch (Exception e) {
            e.printStackTrace();
        }

        return new ByteArrayInputStream(out.toByteArray());
    }
}
