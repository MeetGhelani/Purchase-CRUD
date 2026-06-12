CREATE PROCEDURE USP_SavePurchase
(
    @InwardNo int,
    @ChalanNo int,
    @PDate date,
    @PartyName varchar(100),
    @Terms int,
    @Remarks varchar(200),
    @PurchaseBy varchar(100),
    @TotalAmount decimal(18, 3),
    @DiscountPercent decimal(18, 3),
    @ExtraCost decimal(18, 3),
    @NetAmount decimal(20, 3),

    @PurchaseDetails PurchaseDetailType READONLY
)
AS
BEGIN
    SET NOCOUNT ON;

    BEGIN TRY
        BEGIN TRANSACTION;

        INSERT INTO PurchaseMaster
        (InwardNo, 
         ChalanNo,
         PDate,
         PartyName,
         Terms,
         Remarks,
         PurchaseBy,
         TotalAmount,
         DiscountPercent,
         ExtraCost,
         NetAmount)
        VALUES 
        (@InwardNo,
        @ChalanNo,
        @PDate,
        @PartyName,
        @Terms,
        @Remarks,
        @PurchaseBy,
        @TotalAmount,
        @DiscountPercent,
        @ExtraCost,
        @NetAmount);

        INSERT INTO PurchaseDetail
        (InwardNo, 
        ItemName,
        SubParts,
        Quantity,
        Rate,
        CGST,
        SGST,
        SerTax,
        Amount,
        Remarks)
        SELECT 
        @InwardNo, 
        ItemName, 
        SubParts, 
        Quantity, 
        Rate, 
        CGST, 
        SGST, 
        SerTax, 
        Amount, 
        Remarks
        FROM @PurchaseDetails;

        COMMIT TRANSACTION;

        SELECT CAST(1 AS BIT) AS Success,
                'Purchase saved successfully.' AS Message;

    END TRY
    BEGIN CATCH

        IF @@TRANCOUNT > 0
        ROLLBACK TRANSACTION;
        
        SELECT CAST(0 AS BIT) AS Success,
               ERROR_MESSAGE() AS Message;

    END CATCH
END;