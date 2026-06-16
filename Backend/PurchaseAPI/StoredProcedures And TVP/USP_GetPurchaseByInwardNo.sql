CREATE PROCEDURE USP_GetPurchaseByInwardNo
(
    @InwardNo INT
)
AS
BEGIN

    SET NOCOUNT ON;

    SELECT
        InwardNo,
        ChalanNo,
        PDate,
        PartyName,
        Terms,
        Remarks,
        PurchaseBy,
        TotalAmount,
        DiscountPercent,
        ExtraCost,
        NetAmount
    FROM PurchaseMaster
    WHERE InwardNo = @InwardNo;

    SELECT
        ItemName,
        SubParts,
        Quantity,
        Rate,
        CGST,
        SGST,
        SerTax,
        Amount,
        Remarks
    FROM PurchaseDetail
    WHERE InwardNo = @InwardNo;

END