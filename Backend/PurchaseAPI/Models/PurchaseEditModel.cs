
namespace PurchaseAPI.Models
{
    public class PurchaseEditModel
    {
        public PurchaseMasterModel PurchaseMaster
        {
            get;
            set;
        } = new();

        public List<PurchaseDetailModel> PurchaseDetails
        {
            get;
            set;
        } = new();
    }
}