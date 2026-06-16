CREATE PROCEDURE USP_UpdatePurchase
(
    @InwardNo INT,
    @ChalanNo INT,
    @PDate DATE,
    @PartyName VARCHAR(100),
    @Terms INT,
    @Remarks VARCHAR(500),
    @PurchaseBy VARCHAR(100),
    @TotalAmount DECIMAL(18,3),
    @DiscountPercent DECIMAL(18,3),
    @ExtraCost DECIMAL(18,3),
    @NetAmount DECIMAL(18,3),

    @PurchaseDetails PurchaseDetailType READONLY
)
AS
BEGIN

    SET NOCOUNT ON;

    BEGIN TRY

        BEGIN TRANSACTION;

        -------------------------------------
        -- Update Master
        -------------------------------------

        UPDATE PurchaseMaster
        SET
            ChalanNo = @ChalanNo,
            PDate = @PDate,
            PartyName = @PartyName,
            Terms = @Terms,
            Remarks = @Remarks,
            PurchaseBy = @PurchaseBy,
            TotalAmount = @TotalAmount,
            DiscountPercent = @DiscountPercent,
            ExtraCost = @ExtraCost,
            NetAmount = @NetAmount
        WHERE InwardNo = @InwardNo;

        -------------------------------------
        -- Delete Existing Details
        -------------------------------------

        DELETE FROM PurchaseDetail
        WHERE InwardNo = @InwardNo;

        -------------------------------------
        -- Insert New Details
        -------------------------------------

        INSERT INTO PurchaseDetail
        (
            InwardNo,
            ItemName,
            SubParts,
            Quantity,
            Rate,
            CGST,
            SGST,
            SerTax,
            Amount,
            Remarks
        )
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
                'Purchase updated successfully.' AS Message;

    END TRY
    BEGIN CATCH

        IF @@TRANCOUNT > 0
        ROLLBACK TRANSACTION;
        
        SELECT CAST(0 AS BIT) AS Success,
               ERROR_MESSAGE() AS Message;

    END CATCH
END;