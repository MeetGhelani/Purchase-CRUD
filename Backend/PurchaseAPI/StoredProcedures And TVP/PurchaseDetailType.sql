CREATE TYPE PurchaseDetailType AS TABLE
(
    ItemName varchar(100),
    SubParts varchar(100),
    Quantity decimal(18, 3),
    Rate decimal(18, 3),
    CGST decimal(18, 3),
    SGST decimal(18, 3),
    SerTax decimal(18, 3),
    Amount decimal(18, 3),
    Remarks varchar(200)
);


