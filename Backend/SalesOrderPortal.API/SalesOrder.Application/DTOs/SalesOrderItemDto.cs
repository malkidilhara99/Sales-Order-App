namespace SalesOrderPortal.Application.DTOs
{
    // This represents a single line item from the frontend grid
    public class SalesOrderItemDto
    {
        public int ItemId { get; set; }
        public string Note { get; set; }
        public int Quantity { get; set; }
        public decimal Tax { get; set; } // The tax rate
    }
}