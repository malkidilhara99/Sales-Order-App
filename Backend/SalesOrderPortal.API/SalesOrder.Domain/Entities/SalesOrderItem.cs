using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SalesOrderPortal.Domain.Entities
{
    public class SalesOrderItem
    {
        public int Id { get; set; }
        public string Note { get; set; }
        public int Quantity { get; set; }
        public decimal Tax { get; set; } // The tax rate (e.g., 15 for 15%)

        // Calculated fields for this line
        public decimal ExclAmount { get; set; }
        public decimal TaxAmount { get; set; }
        public decimal InclAmount { get; set; }

        // Relationship back to the main SalesOrder
        public int SalesOrderId { get; set; }
        public SalesOrder SalesOrder { get; set; }

        // Relationship to the Item that was selected
        public int ItemId { get; set; }
        public Item Item { get; set; }
    }
}
