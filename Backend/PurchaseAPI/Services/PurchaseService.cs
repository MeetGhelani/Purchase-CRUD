using PurchaseAPI.Repositories;

namespace PurchaseAPI.Services
{
    public class PurchaseService
    {
        private readonly PurchaseRepository _purchaseRepository;

        public PurchaseService(PurchaseRepository purchaseRepository)
        {
            _purchaseRepository = purchaseRepository;
        }

        public bool TestConnection()
        {
            return _purchaseRepository.TestConnection();
        }
        
        public int GetNextInwardNo()
        {
            return _purchaseRepository.GetNextInwardNo();
        }
    }
}