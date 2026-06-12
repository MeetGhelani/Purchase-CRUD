using Microsoft.Extensions.Configuration;
using Microsoft.Data.SqlClient;    
using System.Data;
using Microsoft.AspNetCore.Mvc;
using PurchaseAPI.DTOs;


namespace PurchaseAPI.Repositories
{
    public class PurchaseRepository
    {
        private readonly IConfiguration _configuration;
        private readonly string _connectionString;

        public PurchaseRepository(IConfiguration configuration)
        {
            _configuration = configuration;
            _connectionString = _configuration.GetConnectionString("DefaultConnection")
            ?? throw new InvalidOperationException(
            "Connection string 'DefaultConnection' not found.");
        }

        public bool TestConnection()
        {
            try
            {
                using SqlConnection con = new SqlConnection(_connectionString);
                con.Open();
                return true;
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error testing database connection: {ex.Message}");
                return false;

                }
            
            }

        public int GetNextInwardNo()
        {
                using SqlConnection con = new SqlConnection(_connectionString);
                using SqlCommand cmd = new SqlCommand("USP_GetNextInwardNo", con);
                cmd.CommandType = CommandType.StoredProcedure;
                con.Open();
                object result = cmd.ExecuteScalar();
                return Convert.ToInt32(result);
        }

        public ApiResponseDTO SavePurchase(PurchaseCreateDTO purchase)
        {
            try
                {
                    using SqlConnection con = new SqlConnection(_connectionString);
                    using SqlCommand cmd = new SqlCommand("USP_SavePurchase", con);
                    cmd.CommandType = CommandType.StoredProcedure;

                    cmd.Parameters.AddWithValue("@InwardNo", purchase.InwardNo);
                    cmd.Parameters.AddWithValue("@ChalanNo", purchase.ChalanNo);
                    cmd.Parameters.AddWithValue("@PDate", purchase.PDate);
                    cmd.Parameters.AddWithValue("@PartyName", purchase.PartyName);
                    cmd.Parameters.AddWithValue("@Terms", purchase.Terms);
                    cmd.Parameters.AddWithValue("@Remarks", purchase.Remarks);
                    cmd.Parameters.AddWithValue("@PurchaseBy", purchase.PurchaseBy);
                    cmd.Parameters.AddWithValue("@TotalAmount", purchase.TotalAmount);
                    cmd.Parameters.AddWithValue("@DiscountPercent", purchase.DiscountPercent);
                    cmd.Parameters.AddWithValue("@ExtraCost", purchase.ExtraCost);
                    cmd.Parameters.AddWithValue("@NetAmount", purchase.NetAmount);

                    DataTable detailTable = new DataTable();
                    detailTable.Columns.Add("ItemName", typeof(string));
                    detailTable.Columns.Add("SubParts", typeof(string));
                    detailTable.Columns.Add("Quantity", typeof(decimal));
                    detailTable.Columns.Add("Rate", typeof(decimal));
                    detailTable.Columns.Add("CGST", typeof(decimal));
                    detailTable.Columns.Add("SGST", typeof(decimal));
                    detailTable.Columns.Add("SerTax", typeof(decimal));
                    detailTable.Columns.Add("Amount", typeof(decimal));
                    detailTable.Columns.Add("Remarks", typeof(string));

                    foreach (var item in purchase.Items)
                    {
                        detailTable.Rows.Add(item.ItemName, item.SubParts, item.Quantity, item.Rate, item.CGST, item.SGST, item.SerTax, item.Amount, item.Remarks);
                    }

                    SqlParameter detailParam = new SqlParameter("@PurchaseDetails", SqlDbType.Structured)
                    {
                        TypeName = "PurchaseDetailType",
                        Value = detailTable
                    };
                    cmd.Parameters.Add(detailParam);

                    con.Open();
                    
                    using SqlDataReader cmdReader = cmd.ExecuteReader();
                    if (cmdReader.Read())
                    {
                        bool success = cmdReader.GetBoolean(0);
                        string message = cmdReader.GetString(1);
                        return new ApiResponseDTO { Success = success, Message = message };
                    }
                    return new ApiResponseDTO { Success = false, Message = "Failed to save purchase." };
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error saving purchase: {ex.Message}");
                return new ApiResponseDTO { Success = false, Message = $"Error: {ex.Message}" };
            }
        }
    
    }

}