using System.Data;
using Microsoft.Data.SqlClient;    
using System.Text;
namespace PurchaseAPI.Repositories
{
    public class LookupRepository
    {
        private readonly string _connection;

        public LookupRepository(IConfiguration configuration)
        {
            _connection =
                configuration.GetConnectionString("DefaultConnection")
                ?? throw new Exception(
                    "Connection string not found.");
        }

        public  List<Dictionary<string, object>> GetLookupData(string tableName)
        {
            using SqlConnection connection = new SqlConnection(_connection);
            using SqlCommand command = new SqlCommand("USP_GetLookupData", connection);
            command.CommandType = CommandType.StoredProcedure;
            command.Parameters.AddWithValue("@TableName", tableName);
            DataTable dt = new DataTable();
            using SqlDataAdapter adapter = new SqlDataAdapter(command);


            adapter.Fill(dt);

            List<Dictionary<string, object>> rows = new();

            foreach (DataRow row in dt.Rows)
            {
                Dictionary<string, object>
                    item = new();

                foreach (DataColumn col in dt.Columns)
                {
                    item[col.ColumnName]
                        = row[col];
                }

                rows.Add(item);
            }

            return rows;
        }

        public List<Dictionary<string, object>> SearchLookup(LookupSearchDTO search)
        {

            List<Dictionary<string, object>>
                rows = new();

            string whereClause = "";

            //----------------------------------
            // Build WHERE Clause
            //----------------------------------

            foreach (var filter
                in search.Filters)
            {
                if (
                    string.IsNullOrWhiteSpace(
                        filter.Value))
                {
                    continue;
                }

                whereClause +=
                    $" AND CAST({filter.Key} AS VARCHAR(100)) LIKE '%{filter.Value}%'";
            }

            //----------------------------------
            // Determine Sort Column
            //----------------------------------

            string orderColumn =
                GetOrderColumn(
                    search.TableName);

            //----------------------------------
            // Execute SP
            //----------------------------------

            using SqlConnection connection =
                new SqlConnection(
                    _connection);

            using SqlCommand command =
                new SqlCommand(
                    "USP_SearchLookup",
                    connection);

            command.CommandType =
                CommandType.StoredProcedure;

            command.Parameters.AddWithValue(
                "@TableName",
                search.TableName);

            command.Parameters.AddWithValue(
                "@WhereClause",
                whereClause);

            command.Parameters.AddWithValue(
                "@OrderColumn",
                orderColumn);

            DataTable dt =
                new DataTable();

            using SqlDataAdapter adapter =
                new SqlDataAdapter(command);

            adapter.Fill(dt);

            // Convert DataTable To List

            foreach (DataRow row in dt.Rows)
            {
                Dictionary<string, object>
                    item = new();

                foreach (
                    DataColumn column
                    in dt.Columns)
                {
                    item[column.ColumnName]
                        = row[column];
                }

                rows.Add(item);
            }

            return rows;
        }

        private string GetOrderColumn(string tableName)
        {
            switch (tableName)
            {
                case "PurchaseMaster":
                    return "InwardNo";

                default:
                    return "ID";
            }
        }
    }
}
