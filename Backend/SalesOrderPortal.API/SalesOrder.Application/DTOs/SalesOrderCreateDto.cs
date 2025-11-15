using System.Collections.Generic;

namespace SalesOrderPortal.Application.DTOs
{
    // This represents the entire "Save Order" request
    public class SalesOrderCreateDto
    {
        public int ClientId { get; set; }
        public string InvoiceNo { get; set; }
        public DateTime InvoiceDate { get; set; }
        public string ReferenceNo { get; set; }
        public string Note { get; set; }

        // A list of the items in the order
        public List<SalesOrderItemDto> OrderItems { get; set; }
    }
}