using System;

namespace SalesOrderPortal.Application.DTOs
{
    public class SalesOrderListDto
    {
        public int Id { get; set; }
        public string InvoiceNo { get; set; }
        public DateTime InvoiceDate { get; set; }
        public string CustomerName { get; set; }
        public decimal TotalIncl { get; set; }
    }
}