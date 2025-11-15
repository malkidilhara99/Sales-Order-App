// You need this to use IConfiguration
using Microsoft.Extensions.Configuration;
using SalesOrderPortal.Application;
using SalesOrderPortal.Infrastructure;

namespace SalesOrderPortal
{
    public static class DependencyInjection
    {
        // Add "IConfiguration configuration" here
        public static IServiceCollection ADDAppDI(this IServiceCollection services, IConfiguration configuration)
        {
            services.ADDApplicationDI(); // This one is fine

            // Pass the configuration object here
            services.ADDInfrastructureDI(configuration);

            return services;
        }
    }
}