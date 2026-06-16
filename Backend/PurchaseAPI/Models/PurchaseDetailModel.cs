namespace PurchaseAPI.Models
{
    public class PurchaseDetailModel
    {
        public string ItemName { get; set; }
        public string SubParts { get; set; }
        public decimal Quantity { get; set; }
        public decimal Rate { get; set; }
        public decimal CGST { get; set; }
        public decimal SGST { get; set; }
        public decimal SerTax { get; set; }
        public decimal Amount { get; set; }
        public string Remarks { get; set; }
    }
}