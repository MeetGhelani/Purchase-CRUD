using Microsoft.Extensions.Configuration;
using Microsoft.Data.SqlClient;    



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
            
            throw new NotImplementedException();
        }
    
    }

}