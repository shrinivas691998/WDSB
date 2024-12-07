using System.ComponentModel.DataAnnotations;

namespace Backend.Models
{
    public class Supply
    {
        [Key]
        public required string SupplyNo { get; set; }
        public required string PartNo { get; set; }
        public DateTime SupplyDate { get; set; }
        public decimal Quantity { get; set; }
    }
} 