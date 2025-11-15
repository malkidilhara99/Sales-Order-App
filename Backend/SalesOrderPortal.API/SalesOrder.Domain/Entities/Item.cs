using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SalesOrderPortal.Domain.Entities
{
    public class Item
    {
        public int Id { get; set; }
        public string ItemCode { get; set; } 
        public string Description { get; set; }
        public decimal Price { get; set; }
    }
}
