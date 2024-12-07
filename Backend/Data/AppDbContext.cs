using Microsoft.EntityFrameworkCore;
using Backend.Models;

namespace Backend.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options)
            : base(options)
        {
        }

        public DbSet<Demand> Demands { get; set; }
        public DbSet<Supply> Supplies { get; set; }
        public DbSet<BOM> BOMs { get; set; }
        public DbSet<WorkOrder> WorkOrders { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            // Configure BOM composite key
            modelBuilder.Entity<BOM>()
                .HasKey(b => new { b.ParentPart, b.ChildPart });

            // Configure decimal precision
            modelBuilder.Entity<BOM>()
                .Property(b => b.RequiredQuantity)
                .HasPrecision(18, 4);

            modelBuilder.Entity<Demand>()
                .Property(d => d.Quantity)
                .HasPrecision(18, 4);

            modelBuilder.Entity<Supply>()
                .Property(s => s.Quantity)
                .HasPrecision(18, 4);
        }
    }
} 