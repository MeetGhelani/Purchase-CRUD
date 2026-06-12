CREATE PROCEDURE USP_GetNextInwardNo
AS
BEGIN
    SET NOCOUNT ON;

    SELECT MAX(InwardNO) + 1 AS [NextInwardNo] FROM PurchaseMaster;
END;