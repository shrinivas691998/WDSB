using System.ComponentModel.DataAnnotations;

namespace Backend.Models
{
    public class Demand
    {
        [Key]
        public required string DemandNo { get; set; }
        public required string PartNo { get; set; }
        public DateTime DemandDate { get; set; }
        public decimal Quantity { get; set; }
    }
} 