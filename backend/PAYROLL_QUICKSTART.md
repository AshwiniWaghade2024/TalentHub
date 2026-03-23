# Quick Start Testing Guide

## 🚀 Build & Run

### Step 1: Build
```bash
cd c:\Users\Acer\OneDrive\Desktop\majorInt\TalentHub\backend\talenthub-backend
mvn clean install
```

### Step 2: Run
```bash
mvn spring-boot:run
```

Wait for: **"Application started successfully"** or similar message.

---

## 🔐 Get Authentication Token

### Step 3: Login as HR
```bash
curl -X POST http://localhost:8080/api/auth/signin \
  -H "Content-Type: application/json" \
  -d '{
    "email": "hr@example.com",
    "password": "password123"
  }'
```

**Response:**
```json
{
  "accessToken": "eyJhbGci...",
  "refreshToken": "...",
  "id": 1,
  "email": "hr@example.com",
  "roles": ["ROLE_HR"]
}
```

**Copy the `accessToken` value and save it for use below.**

---

## 💼 HR Operations

### Test 1: Create Employee Salary
```bash
HR_TOKEN="your_hr_token_here"

curl -X POST http://localhost:8080/api/payroll/salary \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $HR_TOKEN" \
  -d '{
    "employeeId": 1,
    "baseSalary": 50000,
    "pfPercentage": 12,
    "esiPercentage": 0.75
  }'
```

**Expected Response (200):**
```json
{
  "id": 1,
  "employeeId": 1,
  "employeeName": "John Doe",
  "employeeEmail": "john@example.com",
  "departmentName": "Engineering",
  "baseSalary": 50000.00,
  "pfPercentage": 12.00,
  "esiPercentage": 0.75,
  "effectiveFrom": "2024-03-23T10:45:00"
}
```

### Test 2: Get Employee Salary
```bash
curl -X GET http://localhost:8080/api/payroll/salary/1 \
  -H "Authorization: Bearer $HR_TOKEN"
```

### Test 3: Calculate Monthly Payslip
```bash
curl -X POST "http://localhost:8080/api/payroll/calculate?employeeId=1&year=2024&month=03" \
  -H "Authorization: Bearer $HR_TOKEN"
```

**Expected Response (200):**
```json
{
  "baseSalary": 50000.00,
  "pfDeduction": 6000.00,
  "esiDeduction": 375.00,
  "totalDeductions": 6375.00,
  "netSalary": 43625.00
}
```

**✓ Verify Calculations:**
- ✓ PF = 50,000 × 12 ÷ 100 = 6,000 ✓
- ✓ ESI = 50,000 × 0.75 ÷ 100 = 375 ✓
- ✓ Net = 50,000 - 6,375 = 43,625 ✓

### Test 4: Get All Payslips for Month
```bash
curl -X GET "http://localhost:8080/api/payroll/payslips/2024/03?page=0&size=20" \
  -H "Authorization: Bearer $HR_TOKEN"
```

---

## 👤 Employee Operations

### Step 4: Login as Employee
```bash
curl -X POST http://localhost:8080/api/auth/signin \
  -H "Content-Type: application/json" \
  -d '{
    "email": "employee@example.com",
    "password": "password123"
  }'
```

**Copy the `accessToken` and save it:**
```bash
EMP_TOKEN="your_employee_token_here"
```

### Test 5: Employee Views Own Salary
```bash
curl -X GET http://localhost:8080/api/payroll/my/salary \
  -H "Authorization: Bearer $EMP_TOKEN"
```

### Test 6: Employee Views Own Payslips
```bash
curl -X GET "http://localhost:8080/api/payroll/my/payslips?page=0&size=20" \
  -H "Authorization: Bearer $EMP_TOKEN"
```

### Test 7: Employee Views Payslip Details
```bash
curl -X GET http://localhost:8080/api/payroll/my/payslip/1 \
  -H "Authorization: Bearer $EMP_TOKEN"
```

### Test 8: Employee Downloads PDF
```bash
curl -X GET "http://localhost:8080/api/payroll/my/payslip/1/download" \
  -H "Authorization: Bearer $EMP_TOKEN" \
  -o payslip_1.pdf
```

**The PDF file will be saved as `payslip_1.pdf` in your current directory.**

✓ **Verify:**
- ✓ File `payslip_1.pdf` exists
- ✓ File size > 0 KB
- ✓ Open in PDF reader
- ✓ Check content

---

## 🎯 Complete End-to-End Test

```bash
# 1. HR Login
curl -X POST http://localhost:8080/api/auth/signin \
  -H "Content-Type: application/json" \
  -d '{"email":"hr@example.com","password":"password123"}' \
  | jq '.accessToken' > hr_token.txt

# 2. Set HR Token
HR_TOKEN=$(cat hr_token.txt | tr -d '"')

# 3. Create Salary for Employee 1
curl -X POST http://localhost:8080/api/payroll/salary \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $HR_TOKEN" \
  -d '{"employeeId":1,"baseSalary":50000,"pfPercentage":12,"esiPercentage":0.75}'

# 4. Calculate Payslip
CALC=$(curl -s -X POST "http://localhost:8080/api/payroll/calculate?employeeId=1&year=2024&month=03" \
  -H "Authorization: Bearer $HR_TOKEN")
echo "Calculation Result: $CALC"

# 5. Employee Login
curl -X POST http://localhost:8080/api/auth/signin \
  -H "Content-Type: application/json" \
  -d '{"email":"employee@example.com","password":"password123"}' \
  | jq '.accessToken' > emp_token.txt

EMP_TOKEN=$(cat emp_token.txt | tr -d '"')

# 6. Employee Downloads PDF
curl -X GET "http://localhost:8080/api/payroll/my/payslip/1/download" \
  -H "Authorization: Bearer $EMP_TOKEN" \
  -o payslip_final.pdf

echo "✓ Payslip downloaded as payslip_final.pdf"
```

---

## ❌ Error Scenarios

### Test Invalid Employee ID
```bash
curl -X POST http://localhost:8080/api/payroll/salary \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $HR_TOKEN" \
  -d '{"employeeId":9999,"baseSalary":50000}'
```

**Expected Response (400):**
```json
{
  "message": "Error: Employee not found with ID: 9999"
}
```

### Test Invalid Month
```bash
curl -X POST "http://localhost:8080/api/payroll/calculate?employeeId=1&year=2024&month=13" \
  -H "Authorization: Bearer $HR_TOKEN"
```

**Expected Response (400):**
```json
{
  "message": "Error: Month must be between 1 and 12"
}
```

### Test Without Authorization
```bash
curl -X GET http://localhost:8080/api/payroll/salary/1
```

**Expected Response (401):**
```json
{
  "timestamp": "...",
  "status": 401,
  "error": "Unauthorized"
}
```

### Test Employee Accessing HR Endpoint
```bash
curl -X POST http://localhost:8080/api/payroll/salary \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $EMP_TOKEN" \
  -d '{"employeeId":1,"baseSalary":50000}'
```

**Expected Response (403):**
```json
{
  "timestamp": "...",
  "status": 403,
  "error": "Forbidden"
}
```

---

## 📊 Test Multiple Employees

### Create Salaries for Multiple Employees
```bash
# Employee 1: ₹50,000
curl -X POST http://localhost:8080/api/payroll/salary \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $HR_TOKEN" \
  -d '{"employeeId":1,"baseSalary":50000}'

# Employee 2: ₹75,000
curl -X POST http://localhost:8080/api/payroll/salary \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $HR_TOKEN" \
  -d '{"employeeId":2,"baseSalary":75000}'

# Employee 3: ₹100,000
curl -X POST http://localhost:8080/api/payroll/salary \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $HR_TOKEN" \
  -d '{"employeeId":3,"baseSalary":100000}'
```

### Calculate All Payslips
```bash
curl -X POST "http://localhost:8080/api/payroll/calculate?employeeId=1&year=2024&month=03" \
  -H "Authorization: Bearer $HR_TOKEN"

curl -X POST "http://localhost:8080/api/payroll/calculate?employeeId=2&year=2024&month=03" \
  -H "Authorization: Bearer $HR_TOKEN"

curl -X POST "http://localhost:8080/api/payroll/calculate?employeeId=3&year=2024&month=03" \
  -H "Authorization: Bearer $HR_TOKEN"
```

### View All Payslips for Month
```bash
curl -X GET "http://localhost:8080/api/payroll/payslips/2024/03?page=0&size=20" \
  -H "Authorization: Bearer $HR_TOKEN" | jq '.'
```

---

## 📋 Verification Checklist

- [ ] Application starts successfully
- [ ] HR can login and get token
- [ ] HR can create salary for employee
- [ ] HR can view created salary
- [ ] HR can calculate payslip
- [ ] Calculation values are correct
- [ ] Employee can login
- [ ] Employee can view own salary
- [ ] Employee can view own payslips
- [ ] Employee can download PDF
- [ ] PDF file has content
- [ ] HR can view all payslips for month
- [ ] HR can download any employee's payslip
- [ ] Error handling works (400, 401, 403)
- [ ] Pagination works (page, size)

---

## 🐛 Troubleshooting

### Issue: Port 8080 Already in Use
```bash
# Find and kill process
netstat -ano | findstr :8080
taskkill /PID <PID> /F
```

### Issue: Build Fails
```bash
mvn clean
mvn install -DskipTests
```

### Issue: Cannot Download PDF
- Check Authorization header
- Verify payslip exists (calculate it first)
- Check response status code

### Issue: Database Tables Don't Exist
- Add to application.properties: `spring.jpa.hibernate.ddl-auto=create`
- Or create tables manually using provided SQL

### Issue: Authentication Tokens Expire
- Get a new token by logging in again
- Save token in a variable for repeated use

---

## 📞 Common Issues

| Issue | Solution |
|-------|----------|
| 401 Unauthorized | Add `Authorization: Bearer <TOKEN>` header |
| 403 Forbidden | Use correct role (HR for salary ops, EMPLOYEE for own payslips) |
| 404 Not Found | Verify employee/payslip ID exists |
| 400 Bad Request | Check month (1-12), year (>2000), salary > 0 |
| PDF download fails | Ensure payslip exists (calculate first) |

---

All tests should pass! 🎉

