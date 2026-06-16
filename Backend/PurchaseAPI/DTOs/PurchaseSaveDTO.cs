namespace PurchaseAPI.DTOs
{
    public class PurchaseSaveDTO
    {
        public int InwardNo { get; set; }

        public int ChalanNo { get; set; }

        public DateTime PDate { get; set; }

        public string PartyName { get; set; }

        public int Terms { get; set; }

        public string Remarks { get; set; } 

        public string PurchaseBy { get; set; }

        public decimal TotalAmount { get; set; }

        public decimal DiscountPercent { get; set; }

        public decimal ExtraCost { get; set; }

        public decimal NetAmount { get; set; }

        public List<PurchaseDetailDTO> Items { get; set; }

    }
}