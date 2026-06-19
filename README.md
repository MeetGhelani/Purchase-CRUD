# 🛒 Purchase CRUD System

A Purchase Management application built using:

- 🎨 Angular
- ⚙️ ASP.NET Core Web API
- 📋 AG Grid

---

## 🏗️ Architecture

```text
Angular UI
    ↓
Service
    ↓
Controller
    ↓
Service Layer
    ↓
Repository Layer
```

---

## 📋 Purchase Flow

```text
Enter Purchase Details
        ↓
Add Item Details
        ↓
AG Grid Stores Items
        ↓
Calculate Totals
        ↓
Save Purchase
```

---

## 🧮 Auto Calculations

### Detail Amount

```text
Amount
=
(Quantity × Rate)
+ Applicable Taxes
```

### Total Amount

```text
Total Amount
=
Sum of All Item Amounts
```

### Net Amount

```text
Net Amount
=
Total Amount
- Discount
+ Extra Cost
```

---

## 📊 AG Grid Features

### ➕ Add Item

Add multiple purchase items before final save.

### ✏️ Edit Item

```text
Double Click Row
      ↓
Populate Form
      ↓
Update Item
```

### 🗑️ Delete Item

```text
Select Row
      ↓
Press Delete Key
      ↓
Remove Item
```

### 🎯 Row Highlighting

Selected row is highlighted while editing.

---

## ✨ Key Features

- ✅ Purchase Master Entry
- ✅ Purchase Detail Entry
- ✅ AG Grid Integration
- ✅ Auto Amount Calculation
- ✅ Auto Total Calculation
- ✅ Auto Net Amount Calculation
- ✅ Edit Existing Items
- ✅ Delete Items
- ✅ Save Purchase Functionality

---

## 🎉 Outcome

```text
Create Purchase
      ↓
Add Multiple Items
      ↓
Edit / Delete Items
      ↓
Calculate Totals
      ↓
Save Purchase
```

A clean and user-friendly Purchase Entry workflow built with Angular and ASP.NET Core. 🚀