using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Backend.Models
{
    public class WorkOrder
    {
        [Key]
        public required string WorkOrderNo { get; set; }
        public required string MachineNo { get; set; }
        public required string OperatorName { get; set; }
        public int OrderQty { get; set; }
        public int CompletedQty { get; set; }
        
        [NotMapped]
        public int RemainingQty => OrderQty - CompletedQty;
    }
} 