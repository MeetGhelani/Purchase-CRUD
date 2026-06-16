CREATE PROCEDURE USP_GetLookupData
    @TableName VARCHAR(50)
AS  
BEGIN
    IF @TableName = 'PurchaseMaster'
    BEGIN
        SELECT TOP 100
            InwardNo,
            ChalanNo,
            PartyName,
            PDate
        FROM PurchaseMaster
        ORDER BY InwardNo DESC
    END
    
    ELSE
    BEGIN
        RAISERROR('Invalid table name', 16, 1)
    END
END