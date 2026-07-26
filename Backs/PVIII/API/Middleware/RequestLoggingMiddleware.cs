using System.Diagnostics;
using System.Security.Claims;
using Microsoft.Extensions.Logging;

namespace API.Middleware
{
    public class RequestLoggingMiddleware
    {
        private readonly RequestDelegate _next;
        private readonly ILogger<RequestLoggingMiddleware> _logger;

        public RequestLoggingMiddleware(
            RequestDelegate next,
            ILogger<RequestLoggingMiddleware> logger)
        {
            _next = next;
            _logger = logger;
        }

        public async Task InvokeAsync(HttpContext context)
        {
            var stopwatch = Stopwatch.StartNew();

            try
            {
                await _next(context);

                stopwatch.Stop();

                var user =
                    context.User?.FindFirst(ClaimTypes.Email)?.Value ??
                    context.User?.Identity?.Name ??
                    "Anonymous";

                _logger.LogInformation(
                    "HTTP {Method} {Path} responded {StatusCode} in {Elapsed} ms | User={User}",
                    context.Request.Method,
                    context.Request.Path,
                    context.Response.StatusCode,
                    stopwatch.ElapsedMilliseconds,
                    user
                );
            }
            catch (Exception ex)
            {
                stopwatch.Stop();

                var user = context.User?.Identity?.Name ?? "Anonymous";

                _logger.LogError(
                    ex,
                    "HTTP {Method} {Path} FAILED in {Elapsed} ms | User={User}",
                    context.Request.Method,
                    context.Request.Path,
                    stopwatch.ElapsedMilliseconds,
                    user
                );

                throw;
            }
        }
    }
}
