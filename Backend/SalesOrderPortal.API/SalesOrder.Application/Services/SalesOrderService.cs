using SalesOrderPortal.Application.DTOs;
using SalesOrderPortal.Application.Interfaces;
using SalesOrderPortal.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq; 
using System.Threading.Tasks;

namespace SalesOrderPortal.Application.Services
{
    public class SalesOrderService : ISalesOrderService
    {
        private readonly ISalesOrderRepository _salesOrderRepository;
        private readonly IItemRepository _itemRepository;
        private readonly IUnitOfWork _unitOfWork;

        public SalesOrderService(ISalesOrderRepository salesOrderRepository, IItemRepository itemRepository, IUnitOfWork unitOfWork)
        {
            _salesOrderRepository = salesOrderRepository;
            _itemRepository = itemRepository;
            _unitOfWork = unitOfWork;
        }

        public async Task CreateSalesOrderAsync(SalesOrderCreateDto salesOrderDto)
        {
            // 1. Create the main SalesOrder entity
            var salesOrder = new SalesOrder
            {
                ClientId = salesOrderDto.ClientId,
                InvoiceNo = salesOrderDto.InvoiceNo,
                InvoiceDate = salesOrderDto.InvoiceDate,
                ReferenceNo = salesOrderDto.ReferenceNo,
                Note = salesOrderDto.Note,
                OrderItems = new List<SalesOrderItem>(),
                TotalExcl = 0,
                TotalTax = 0,
                TotalIncl = 0
            };

            // Get all items from DB to find their prices
            var allItems = await _itemRepository.GetAllAsync();

            // 2. Loop through each item in the DTO, calculate, and add to the order
            foreach (var itemDto in salesOrderDto.OrderItems)
            {
                // Find the item's price from the database
                var item = allItems.FirstOrDefault(i => i.Id == itemDto.ItemId);
                if (item == null)
                {
                    throw new Exception($"Item with ID {itemDto.ItemId} not found.");
                }

                decimal price = item.Price;

                // 3. Perform calculations
                decimal exclAmount = itemDto.Quantity * price;
                decimal taxAmount = (exclAmount * itemDto.Tax) / 100;
                decimal inclAmount = exclAmount + taxAmount;

                // 4. Create the SalesOrderItem entity
                var orderItem = new SalesOrderItem
                {
                    ItemId = itemDto.ItemId,
                    Note = itemDto.Note,
                    Quantity = itemDto.Quantity,
                    Tax = itemDto.Tax,
                    ExclAmount = exclAmount,
                    TaxAmount = taxAmount,
                    InclAmount = inclAmount,
                    SalesOrder = salesOrder
                };

                // 5. Add to the main order
                salesOrder.OrderItems.Add(orderItem);

                // 6. Update the grand totals
                salesOrder.TotalExcl += exclAmount;
                salesOrder.TotalTax += taxAmount;
                salesOrder.TotalIncl += inclAmount;
            }

            // 7. Add the completed order to the repository
            await _salesOrderRepository.AddAsync(salesOrder);

            // 8. Save all changes to the database using the Unit of Work
            await _unitOfWork.SaveChangesAsync();
        }

        // VVV THIS IS THE MISSING METHOD VVV
        public async Task<IEnumerable<SalesOrderListDto>> GetAllSalesOrdersAsync()
        {
            var salesOrders = await _salesOrderRepository.GetAllAsync();

            // Map the database entities to our simple DTOs
            return salesOrders.Select(so => new SalesOrderListDto
            {
                Id = so.Id,
                InvoiceNo = so.InvoiceNo,
                InvoiceDate = so.InvoiceDate,
                CustomerName = so.Client.CustomerName, // This is why we used .Include()
                TotalIncl = so.TotalIncl
            }).ToList();
        }

        public async Task<SalesOrderDetailDto> GetSalesOrderByIdAsync(int id)
        {
            var order = await _salesOrderRepository.GetByIdAsync(id);

            if (order == null)
            {
                return null; // Or throw an exception
            }

            // Map the main order
            var orderDto = new SalesOrderDetailDto
            {
                Id = order.Id,
                ClientId = order.ClientId,
                InvoiceNo = order.InvoiceNo,
                InvoiceDate = order.InvoiceDate,
                ReferenceNo = order.ReferenceNo,
                Note = order.Note,
                TotalExcl = order.TotalExcl,
                TotalTax = order.TotalTax,
                TotalIncl = order.TotalIncl
            };

            // Map each line item
            foreach (var item in order.OrderItems)
            {
                orderDto.OrderItems.Add(new SalesOrderDetailItemDto
                {
                    Id = item.Id,
                    ItemId = item.ItemId,
                    ItemCode = item.Item.ItemCode, // We can do this because we used .ThenInclude()
                    Description = item.Item.Description,
                    Price = item.Item.Price,
                    Note = item.Note,
                    Quantity = item.Quantity,
                    Tax = item.Tax,
                    ExclAmount = item.ExclAmount,
                    TaxAmount = item.TaxAmount,
                    InclAmount = item.InclAmount
                });
            }

            return orderDto;
        }

        public async Task UpdateSalesOrderAsync(int id, SalesOrderCreateDto salesOrderDto)
        {
            // 1. Get the existing order from the database
            //    We must include the .OrderItems to be able to delete them
            var existingOrder = await _salesOrderRepository.GetByIdAsync(id);
            if (existingOrder == null)
            {
                throw new Exception($"SalesOrder with ID {id} not found.");
            }

            // 2. Clear out the old line items
            _salesOrderRepository.RemoveSalesOrderItems(existingOrder.OrderItems);
            existingOrder.OrderItems.Clear();

            // 3. Update the main order properties from the DTO
            existingOrder.ClientId = salesOrderDto.ClientId;
            existingOrder.InvoiceNo = salesOrderDto.InvoiceNo;
            existingOrder.InvoiceDate = salesOrderDto.InvoiceDate;
            existingOrder.ReferenceNo = salesOrderDto.ReferenceNo;
            existingOrder.Note = salesOrderDto.Note;

            // 4. Reset totals before recalculating
            existingOrder.TotalExcl = 0;
            existingOrder.TotalTax = 0;
            existingOrder.TotalIncl = 0;

            // Get all items from DB to find their prices
            var allItems = await _itemRepository.GetAllAsync();

            // 5. Loop through the *new* DTO items, calculate, and add them
            foreach (var itemDto in salesOrderDto.OrderItems)
            {
                var item = allItems.FirstOrDefault(i => i.Id == itemDto.ItemId);
                if (item == null)
                {
                    throw new Exception($"Item with ID {itemDto.ItemId} not found.");
                }

                decimal price = item.Price;

                // 6. Perform calculations
                decimal exclAmount = itemDto.Quantity * price; 
                decimal taxAmount = (exclAmount * itemDto.Tax) / 100; 
                decimal inclAmount = exclAmount + taxAmount; 

        var newOrderItem = new SalesOrderItem
        {
            ItemId = itemDto.ItemId,
            Note = itemDto.Note,
            Quantity = itemDto.Quantity,
            Tax = itemDto.Tax,
            ExclAmount = exclAmount,
            TaxAmount = taxAmount,
            InclAmount = inclAmount,
            SalesOrder = existingOrder // Link to the existing order
        };

                existingOrder.OrderItems.Add(newOrderItem);

                // 7. Update grand totals
                existingOrder.TotalExcl += exclAmount;
                existingOrder.TotalTax += taxAmount;
                existingOrder.TotalIncl += inclAmount;
            }

            // 8. Save all changes to the database
            await _unitOfWork.SaveChangesAsync();
        }
    }
}