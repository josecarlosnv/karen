using DL;
using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;
using ML;
using System;
using System.Collections.Generic;
using System.Text;

namespace BL
{
    public class SubOtherFunctionsBL
    {
        private readonly MexItaStaBiAuditContext _context;

        public SubOtherFunctionsBL(MexItaStaBiAuditContext context)
        {
            _context = context;
        }
        /*
        private async Task<string> ResolveBusinessEmail(string email)
        {
            var normalized = email.Trim().ToLower();

            var emp = await _context.PviiiCatColabs
                .AsNoTracking()
                .Where(e =>
                    e.EmployeeEmail.ToLower() == normalized ||
                    (normalized.Contains("@") &&
                     e.NetworkId == normalized.Split('@')[0]))
                .Select(e => e.EmployeeEmail)
                .FirstOrDefaultAsync();

            return !string.IsNullOrWhiteSpace(emp)
                ? emp.Trim().ToLower()
                : normalized;
        }
        */
        public async Task<bool> Insert(SubOtherFunctionsML model)
        {
            string sql = @"
                INSERT INTO PVIII_Sub_OtherFunctions
                (
                    approvalIndicator,
                    costCenter,
                    servicesLine,
                    comments,
                    createBy
                )
                VALUES
                (
                    @approvalIndicator,
                    @costCenter,
                    @servicesLine,
                    @comments,
                    @createBy
                )";

            var rows = await _context.Database.ExecuteSqlRawAsync(
                sql,
                new SqlParameter("@approvalIndicator", model.approvalIndicator),
                new SqlParameter("@costCenter", model.costCenter),
                new SqlParameter("@servicesLine", model.servicesLine),
                new SqlParameter("@comments", (object?)model.comments ?? DBNull.Value),
                new SqlParameter("@createBy", model.createBy)
                //new SqlParameter("@createBy", await ResolveBusinessEmail(model.createBy))
            );
            return rows > 0;
        }

        public async Task<List<SubOtherFunctionsML>> GetByCreateBy(string createBy)
        {
            var result = new List<SubOtherFunctionsML>();

            using var conn = _context.Database.GetDbConnection();

            await conn.OpenAsync();

            using var cmd = conn.CreateCommand();

            cmd.CommandText = @"
        SELECT
            p8OtherFunctPK,
            approvalIndicator,
            servicesLine,
            comments,
            isActive,
            recordChangeSequence,
            [create],
            createBy
        FROM PVIII_Sub_OtherFunctions
        WHERE createBy = @createBy";

            var param = cmd.CreateParameter();
            param.ParameterName = "@createBy";
            param.Value = createBy;
            cmd.Parameters.Add(param);

             using var reader = await cmd.ExecuteReaderAsync();

            while (await reader.ReadAsync())
            {
                result.Add(new SubOtherFunctionsML
                {
                    p8OtherFunctPK = Convert.ToInt32(reader["p8OtherFunctPK"]),
                    approvalIndicator = Convert.ToBoolean(reader["approvalIndicator"]),
                    servicesLine = reader["servicesLine"].ToString(),
                    comments = reader["comments"]?.ToString(),
                    //isactive = Convert.ToBoolean(reader["isActive"]),
                    //recordChangeSequence,
                    //create,
                    createBy = reader["createBy"].ToString()
                });
            }

            return result;
        }
    }

}
