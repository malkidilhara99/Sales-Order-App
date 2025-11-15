using System;
using System.Collections.Generic;

namespace SalesOrderPortal.Application.DTOs
{
    // This represents the full order for the edit screen
    public class SalesOrderDetailDto
    {
        public int Id { get; set; }
        public int ClientId { get; set; }
        public string InvoiceNo { get; set; }
        public DateTime InvoiceDate { get; set; }
        public string ReferenceNo { get; set; }
        public string Note { get; set; }

        public decimal TotalExcl { get; set; }
        public decimal TotalTax { get; set; }
        public decimal TotalIncl { get; set; }

        // The list of all items on this order
        public List<SalesOrderDetailItemDto> OrderItems { get; set; } = new List<SalesOrderDetailItemDto>();
    }
}