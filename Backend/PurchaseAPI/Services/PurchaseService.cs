using PurchaseAPI.Repositories;
using PurchaseAPI.DTOs;
using PurchaseAPI.Models;

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

        public ApiResponseDTO SavePurchase(PurchaseSaveDTO purchase)
        {
            //PurchaseMaster table validations
            if (purchase == null)
            {
                return new ApiResponseDTO { Success = false, Message = "Purchase data is required." };
            }

            if (purchase.ChalanNo <= 0)
            {
                return new ApiResponseDTO { Success = false, Message = "Chalan number is required." };
            }

            if (purchase.PDate.Date > DateTime.Now.Date)
            {
                return new ApiResponseDTO { Success = false, Message = "Purchase date cannot be in the future." };
            }

            if (string.IsNullOrWhiteSpace(purchase.PartyName))
            {
                return new ApiResponseDTO { Success = false, Message = "Party name is required." };
            }

            if (purchase.Terms <= 0)
            {
                return new ApiResponseDTO { Success = false, Message = "Terms are required." };
            }

            if (string.IsNullOrWhiteSpace(purchase.PurchaseBy))
            {
                return new ApiResponseDTO { Success = false, Message = "PurchaseBy name is required." };    
            }

            if (purchase.TotalAmount <= 0)
            {
                return new ApiResponseDTO { Success = false, Message = "Total amount must be greater than zero." };
            }

            if (purchase.NetAmount <= 0)
            {
                return new ApiResponseDTO { Success = false, Message = "Net amount must be greater than zero." };
            }

            if (purchase.Items == null || !purchase.Items.Any())
            {
                return new ApiResponseDTO { Success = false, Message = "At least one purchase item is required." };
            }

            //PurchaseDetail table validations
                foreach (var item in purchase.Items)
                {
                    if (string.IsNullOrWhiteSpace(item.ItemName))
                    {
                        return new ApiResponseDTO { Success = false, Message = "Item name is required." };
                    }
    
                    if (item.Quantity <= 0)
                    {
                        return new ApiResponseDTO { Success = false, Message = $"Quantity must be greater than zero." };
                    }
    
                    if (item.Rate < 0)
                    {
                        return new ApiResponseDTO { Success = false, Message = $"Rate must be greater than zero." };
                    }
                }

            //call repository
            return _purchaseRepository.SavePurchase(purchase);
        }

        public PurchaseEditModel GetPurchaseByInwardNo(int inwardNo)
        {
            return _purchaseRepository.GetPurchaseByInwardNo(inwardNo);
        }

        public ApiResponseDTO UpdatePurchase(PurchaseSaveDTO purchase)
        {
            // Similar validations as SavePurchase can be added here

            return _purchaseRepository.UpdatePurchase(purchase);
        }
    }
}
