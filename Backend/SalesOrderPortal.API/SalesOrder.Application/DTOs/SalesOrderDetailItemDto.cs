namespace SalesOrderPortal.Application.DTOs
{
    // This represents one line item for the edit screen
    public class SalesOrderDetailItemDto
    {
        public int Id { get; set; }
        public int ItemId { get; set; }
        public string ItemCode { get; set; }
        public string Description { get; set; }
        public string Note { get; set; }
        public int Quantity { get; set; }
        public decimal Price { get; set; }
        public decimal Tax { get; set; }
        public decimal ExclAmount { get; set; }
        public decimal TaxAmount { get; set; }
        public decimal InclAmount { get; set; }
    }
}