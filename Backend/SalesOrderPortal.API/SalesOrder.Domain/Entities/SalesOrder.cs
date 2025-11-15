using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SalesOrderPortal.Domain.Entities
{
    public class SalesOrder
    {
        public int Id { get; set; }
        public string InvoiceNo { get; set; }
        public DateTime InvoiceDate { get; set; }
        public string ReferenceNo { get; set; }
        public string Note { get; set; } 

        // Relationship to the Client
        public int ClientId { get; set; }
        public Client Client { get; set; }

        // Relationship to the line items
        // We need to initialize it to avoid errors
        public ICollection<SalesOrderItem> OrderItems { get; set; } = new List<SalesOrderItem>();

        // Order Totals
        public decimal TotalExcl { get; set; }
        public decimal TotalTax { get; set; }
        public decimal TotalIncl { get; set; }
    }
}
