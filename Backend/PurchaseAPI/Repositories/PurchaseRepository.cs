using Microsoft.Data.SqlClient;    
using System.Data;
using PurchaseAPI.DTOs;
using PurchaseAPI.Models;

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

        public ApiResponseDTO SavePurchase(PurchaseSaveDTO purchase)
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

      public PurchaseEditModel GetPurchaseByInwardNo(int inwardNo)
        {
            PurchaseEditModel purchase =
                new();

            using SqlConnection connection =
                new SqlConnection(_connectionString);

            using SqlCommand command =
                new SqlCommand(
                    "USP_GetPurchaseByInwardNo",
                    connection);

            command.CommandType =
                CommandType.StoredProcedure;

            command.Parameters.AddWithValue(
                "@InwardNo",
                inwardNo);

            connection.Open();

            using SqlDataReader reader =
                command.ExecuteReader();

            // =========================
            // Master
            // =========================

            if (reader.Read())
            {
                purchase.PurchaseMaster =
                    new PurchaseMasterModel
                    {
                        InwardNo =
                            Convert.ToInt32(
                                reader["InwardNo"]),

                        ChalanNo =
                            Convert.ToInt32(
                                reader["ChalanNo"]),

                         PDate =
                            Convert.ToDateTime(
                                reader["PDate"]),

                        PartyName =
                            reader["PartyName"]
                            .ToString(),

                        Terms =
                            Convert.ToInt32(
                                reader["Terms"]),

                        Remarks =
                            reader["Remarks"]
                            .ToString(),

                        PurchaseBy =
                            reader["PurchaseBy"]
                            .ToString(),

                        TotalAmount =
                            Convert.ToDecimal(
                                reader["TotalAmount"]),

                        DiscountPercent =
                            Convert.ToDecimal(
                                reader["DiscountPercent"]),

                        ExtraCost =
                            Convert.ToDecimal(
                                reader["ExtraCost"]),

                        NetAmount =
                            Convert.ToDecimal(
                                reader["NetAmount"])

                    };
            }

            // =========================
            // Move To Detail Result
            // =========================

            reader.NextResult();

            while (reader.Read())
            {

                purchase.PurchaseDetails.Add(
                    new PurchaseDetailModel
                    {
                        ItemName =
                            reader["ItemName"]
                            .ToString(),

                        SubParts =
                            reader["SubParts"]
                            .ToString(),

                        Quantity =
                            Convert.ToDecimal(
                                reader["Quantity"]),

                        Rate =
                            Convert.ToDecimal(
                                reader["Rate"]),

                        CGST =
                            Convert.ToDecimal(
                                reader["CGST"]),

                        SGST =
                            Convert.ToDecimal(
                                reader["SGST"]),

                        SerTax =
                            Convert.ToDecimal(
                                reader["SerTax"]),

                        Amount =
                            Convert.ToDecimal(
                                reader["Amount"]),

                        Remarks =
                            reader["Remarks"]
                            .ToString()
                    });
            }

            return purchase;
        }

        public ApiResponseDTO UpdatePurchase(PurchaseSaveDTO purchase)
        {
            try
                {
                    using SqlConnection con = new SqlConnection(_connectionString);
                    using SqlCommand cmd = new SqlCommand("USP_UpdatePurchase", con);
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
                    return new ApiResponseDTO { Success = false, Message = "Failed to update purchase." };
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error updating purchase: {ex.Message}");
                return new ApiResponseDTO { Success = false, Message = $"Error: {ex.Message}" };
            }

        }

        public ApiResponseDTO DeletePurchase(int inwardNo)
        {
            try
            {
                using SqlConnection con = new SqlConnection(_connectionString);
                using SqlCommand cmd = new SqlCommand("USP_DeletePurchase", con);
                cmd.CommandType = CommandType.StoredProcedure;

                cmd.Parameters.AddWithValue("@InwardNo", inwardNo);

                con.Open();

                using SqlDataReader cmdReader = cmd.ExecuteReader();
                if (cmdReader.Read())
                {
                    bool success = cmdReader.GetBoolean(0);
                    string message = cmdReader.GetString(1);
                    return new ApiResponseDTO { Success = success, Message = message };
                }
                return new ApiResponseDTO { Success = false, Message = "Failed to delete purchase." };
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error deleting purchase: {ex.Message}");
                return new ApiResponseDTO { Success = false, Message = $"Error: {ex.Message}" };
            }
        }

    }

}