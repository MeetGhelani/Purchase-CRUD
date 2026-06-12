using Microsoft.Extensions.Configuration;
using Microsoft.Data.SqlClient;    
using System.Data;


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
    
    }

}