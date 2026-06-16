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

            using SqlConnection connection =
                new SqlConnection(
                    _connection);

            //----------------------------------
            // Validate Table Name
            //----------------------------------

            List<string> allowedTables =
            [
                "PurchaseMaster",
                "PurchaseDetail"
            ];

            if (!allowedTables.Contains(
                    search.TableName))
            {
                throw new Exception(
                    "Invalid Table Name");
            }

            //----------------------------------
            // Build Query
            //----------------------------------

            string sql =
                $@"
                SELECT TOP 100 *
                FROM {search.TableName}
                WHERE 1 = 1
                ";

            SqlCommand command =
                new SqlCommand();

            int parameterIndex = 0;

            //----------------------------------
            // Filters
            //----------------------------------

            foreach (var filter
                in search.Filters)
            {
                if (string.IsNullOrWhiteSpace(
                        filter.Value))
                {
                    continue;
                }

                string parameterName =
                    "@P" + parameterIndex;

                sql +=
                    $" AND {filter.Key} LIKE {parameterName}";

                command.Parameters.AddWithValue(
                    parameterName,
                    "%" + filter.Value + "%");

                parameterIndex++;
            }

            //----------------------------------
            // Sort
            //----------------------------------

            if (search.TableName ==
                "PurchaseMaster")
            {
                sql +=
                    " ORDER BY InwardNo DESC";
            }
            else
            {
                sql +=
                    " ORDER BY InwardNo DESC";
            }

            command.CommandText =
                sql;

            command.Connection =
                connection;

            //----------------------------------
            // Execute
            //----------------------------------

            connection.Open();

            using SqlDataAdapter adapter =
                new SqlDataAdapter(command);

            DataTable dt =
                new DataTable();

            adapter.Fill(dt);

            //----------------------------------
            // Convert To List
            //----------------------------------

            foreach (DataRow row
                in dt.Rows)
            {
                Dictionary<string, object>
                    item = new();

                foreach (DataColumn column
                    in dt.Columns)
                {
                    item[column.ColumnName] =
                        row[column];
                }

                rows.Add(item);
            }

            return rows;
        }
    }
}
