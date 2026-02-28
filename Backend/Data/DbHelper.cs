// Condensed comment block.

using MySql.Data.MySqlClient;
using System.Data;

namespace RecipeSharingAPI.Data
{
    /// <summary>
    public class DbHelper
    {
        // Connection string is stored as a private readonly field
        // to prevent modification after construction
        private readonly string _connectionString;

        /// <summary>
        public DbHelper(IConfiguration configuration)
        {
            // Retrieve the connection string from appsettings.json
            // The "DefaultConnection" key is defined in the ConnectionStrings section
            _connectionString = configuration.GetConnectionString("DefaultConnection")
                ?? throw new InvalidOperationException("Connection string 'DefaultConnection' not found.");
        }

        /// <summary>
        public MySqlConnection GetConnection()
        {
            return new MySqlConnection(_connectionString);
        }

        /// <summary>
        public DataTable ExecuteQuery(string query, MySqlParameter[]? parameters = null)
        {
            // DataTable holds the results in memory (rows and columns)
            var dataTable = new DataTable();

            // 'using' block ensures the connection is always closed/disposed,
            // even if an exception occurs. This prevents connection leaks.
            using (var connection = GetConnection())
            {
                connection.Open();
                using (var command = new MySqlCommand(query, connection))
                {
                    // Add parameters if provided (for parameterized queries)
                    if (parameters != null)
                    {
                        command.Parameters.AddRange(parameters);
                    }

                    // MySqlDataAdapter fills the DataTable with query results
                    // It automatically handles opening/closing the reader
                    using (var adapter = new MySqlDataAdapter(command))
                    {
                        adapter.Fill(dataTable);
                    }
                }
            }

            return dataTable;
        }

        /// <summary>
        public int ExecuteNonQuery(string query, MySqlParameter[]? parameters = null)
        {
            using (var connection = GetConnection())
            {
                connection.Open();
                using (var command = new MySqlCommand(query, connection))
                {
                    if (parameters != null)
                    {
                        command.Parameters.AddRange(parameters);
                    }
                    return command.ExecuteNonQuery();
                }
            }
        }

        /// <summary>
        public object? ExecuteScalar(string query, MySqlParameter[]? parameters = null)
        {
            using (var connection = GetConnection())
            {
                connection.Open();
                using (var command = new MySqlCommand(query, connection))
                {
                    if (parameters != null)
                    {
                        command.Parameters.AddRange(parameters);
                    }
                    return command.ExecuteScalar();
                }
            }
        }
    }
}
