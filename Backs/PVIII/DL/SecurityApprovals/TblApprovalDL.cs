using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Text;

namespace DL
{
    public class TblApproval
    {
        public int? lvl { get; set; }
        public string ApproverEmail { get; set; } = null!;
    }

    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

        public DbSet<TblApproval> Tbl_Approvals => Set<TblApproval>();

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<TblApproval>(e =>
            {
                e.ToTable("Tbl_Approvals", "dbo");
                e.HasKey(x => x.lvl);
                e.Property(x => x.ApproverEmail).HasMaxLength(200).IsRequired();
            });
        }
    }
}
