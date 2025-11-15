using Microsoft.Extensions.DependencyInjection;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SalesOrderPortal.Domain
{
    public static class DependencyInjection
    {
        public static IServiceCollection ADDDomainDI(this IServiceCollection services)
        {
            // Add application services here in the future
            return services;
        }
    }
}
