using Microsoft.Data.SqlClient;
using Microsoft.Extensions.Configuration;
using ML;

namespace BL;

public interface IAdministrationBL
{
    Task<List<SecurityUser>> GetUsersAsync();
    Task<int> CreateUserAsync(SecurityUserRequest req);
    Task UpdateUserAsync(int id, SecurityUserRequest req);
    Task DeleteUserAsync(int id);
    Task<bool> UserIsAdminAsync(string email);
}

public class AdministrationBL : IAdministrationBL
{
    private readonly string _conn;

    public AdministrationBL(IConfiguration config)
    {
        _conn = config.GetConnectionString("DefaultConnection")!;
    }

    public async Task<List<SecurityUser>> GetUsersAsync()
    {
        var list = new List<SecurityUser>();
        using var cn = new SqlConnection(_conn);
        await cn.OpenAsync();
        using var cmd = new SqlCommand(
            "SELECT ID, Email, Role, BU, Is_Committee, TypeCommittee FROM SecurityScorefy ORDER BY ID", cn);
        using var reader = await cmd.ExecuteReaderAsync();
        while (await reader.ReadAsync())
        {
            list.Add(new SecurityUser
            {
                ID           = reader.GetInt32(0),
                Email        = reader.GetString(1),
                Role         = reader.GetString(2),
                BU           = reader.IsDBNull(3) ? null : reader.GetString(3),
                Is_Committee = reader.IsDBNull(4) ? null : reader.GetBoolean(4),
                TypeCommittee = reader.IsDBNull(5) ? null : reader.GetString(5),
            });
        }
        return list;
    }

    public async Task<int> CreateUserAsync(SecurityUserRequest req)
    {
        using var cn = new SqlConnection(_conn);
        await cn.OpenAsync();
        using var cmd = new SqlCommand(@"
            INSERT INTO SecurityScorefy (Email, Role, BU, Is_Committee, TypeCommittee)
            OUTPUT INSERTED.ID
            VALUES (@Email, @Role, @BU, @IsCommittee, @TypeCommittee)", cn);
        cmd.Parameters.AddWithValue("@Email",        req.Email);
        cmd.Parameters.AddWithValue("@Role",         req.Role);
        cmd.Parameters.AddWithValue("@BU",           (object?)req.BU           ?? DBNull.Value);
        cmd.Parameters.AddWithValue("@IsCommittee",  (object?)req.IsCommittee  ?? DBNull.Value);
        cmd.Parameters.AddWithValue("@TypeCommittee",(object?)req.TypeCommittee ?? DBNull.Value);
        return (int)(await cmd.ExecuteScalarAsync())!;
    }

    public async Task UpdateUserAsync(int id, SecurityUserRequest req)
    {
        using var cn = new SqlConnection(_conn);
        await cn.OpenAsync();
        using var cmd = new SqlCommand(@"
            UPDATE SecurityScorefy
            SET Email = @Email, Role = @Role, BU = @BU,
                Is_Committee = @IsCommittee, TypeCommittee = @TypeCommittee
            WHERE ID = @ID", cn);
        cmd.Parameters.AddWithValue("@ID",           id);
        cmd.Parameters.AddWithValue("@Email",        req.Email);
        cmd.Parameters.AddWithValue("@Role",         req.Role);
        cmd.Parameters.AddWithValue("@BU",           (object?)req.BU           ?? DBNull.Value);
        cmd.Parameters.AddWithValue("@IsCommittee",  (object?)req.IsCommittee  ?? DBNull.Value);
        cmd.Parameters.AddWithValue("@TypeCommittee",(object?)req.TypeCommittee ?? DBNull.Value);
        await cmd.ExecuteNonQueryAsync();
    }

    public async Task DeleteUserAsync(int id)
    {
        using var cn = new SqlConnection(_conn);
        await cn.OpenAsync();
        using var cmd = new SqlCommand("DELETE FROM SecurityScorefy WHERE ID = @ID", cn);
        cmd.Parameters.AddWithValue("@ID", id);
        await cmd.ExecuteNonQueryAsync();
    }

    public async Task<bool> UserIsAdminAsync(string email)
    {
        using var cn = new SqlConnection(_conn);
        await cn.OpenAsync();
        using var cmd = new SqlCommand(
            "SELECT COUNT(1) FROM SecurityScorefy WHERE Email = @Email AND Role = 'ALL'", cn);
        cmd.Parameters.AddWithValue("@Email", email);
        return (int)(await cmd.ExecuteScalarAsync())! > 0;
    }
}
