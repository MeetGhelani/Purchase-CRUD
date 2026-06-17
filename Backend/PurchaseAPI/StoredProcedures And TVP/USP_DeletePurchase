CREATE PROCEDURE USP_DeletePurchase
(
    @InwardNo INT
)
AS
BEGIN

    BEGIN TRY

        BEGIN TRANSACTION

        DELETE FROM PurchaseDetail
        WHERE InwardNo = @InwardNo

        DELETE FROM PurchaseMaster
        WHERE InwardNo = @InwardNo

        COMMIT TRANSACTION

        SELECT
            CAST(1 AS BIT) AS Success, 'Purchase Deleted Successfully' AS Message

    END TRY

    BEGIN CATCH

        ROLLBACK TRANSACTION

        SELECT
            CAST(0 AS BIT) AS Success, ERROR_MESSAGE() AS Message

    END CATCH

END