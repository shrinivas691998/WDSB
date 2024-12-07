using System.ComponentModel.DataAnnotations;

namespace Backend.Models
{
    public class BOM
    {
        [Key]
        public required string ParentPart { get; set; }
        public required string ChildPart { get; set; }
        public int OpNo { get; set; }
        public decimal RequiredQuantity { get; set; }
    }
} 