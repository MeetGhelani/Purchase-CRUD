using PurchaseAPI.Repositories;
using System.Data;
namespace PurchaseAPI.Services
{
    public class LookupService
    {
        private readonly LookupRepository _lookupRepository;

        public LookupService(LookupRepository lookupRepository)
        {
            _lookupRepository = lookupRepository;
        }

        public List<Dictionary<string, object>> GetLookupData(string tableName)
        {
            return _lookupRepository.GetLookupData(tableName);
        }

        public List<Dictionary<string, object>>SearchLookup(LookupSearchDTO search)
        {
            return _lookupRepository
                .SearchLookup(search);
        }

    }
}