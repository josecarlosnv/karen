using System.Data;
using Microsoft.Data.SqlClient;

var builder = WebApplication.CreateBuilder(args);

Dapper.DefaultTypeMap.MatchNamesWithUnderscores = true;

builder.Services.AddControllers();

builder.Services.AddScoped<IDbConnection>(sp =>
    new SqlConnection(builder.Configuration.GetConnectionString("DefaultConnection")));

// ✅ CORS – Intelligence Studio shell (host:puerto, SIN rutas)
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
    {
        policy.WithOrigins(
            // ── localhost (desarrollo) ──
            "http://localhost",
            "http://localhost:5173",
            "http://localhost:8081",

            // ── mxmexapp295 (DEV) ──
            "http://mxmexapp295",
            "http://mxmexapp295:80",
            "http://mxmexapp295:5173",
            "http://mxmexapp295:5245",
            "http://mxmexapp295:8080",
            "http://mxmexapp295:8081",
            "http://mxmexapp295:8085",

            // ── mxmexapp150 (PROD) – http ──
            "http://mxmexapp150",
            "http://mxmexapp150:5173",
            "http://mxmexapp150:5245",
            "http://mxmexapp150:8081",
            "http://mxmexapp150:8085",
            // ── mxmexapp150 (PROD) – https ──
            "https://mxmexapp150",
            "https://mxmexapp150:5173",
            "https://mxmexapp150:5245",
            "https://mxmexapp150:8081",
            "https://mxmexapp150:8085",

            // ── Intelligence Studio (FQDN) – puertos de la super-app ──
            "https://intelligencestudio.mx.kworld.kpmg.com",
            "https://intelligencestudio.mx.kworld.kpmg.com:9443",   // shell
            "https://intelligencestudio.mx.kworld.kpmg.com:5443",   // PVIII
            "https://intelligencestudio.mx.kworld.kpmg.com:8443",   // Scorefy
            "https://intelligencestudio.mx.kworld.kpmg.com:5021",   // Quality Metrics
            "https://intelligencestudio.mx.kworld.kpmg.com:3000",   // EQCR
            "http://intelligencestudio.mx.kworld.kpmg.com",
            // variante con "InteligenceStudio" (una sola L)
            "https://InteligenceStudio.mx.kworld.kpmg.com",
            "https://InteligenceStudio.mx.kworld.kpmg.com:9443",
            "http://InteligenceStudio.mx.kworld.kpmg.com"
            )
            .AllowAnyHeader()
            .AllowAnyMethod()
            .AllowCredentials();
    });
});

var app = builder.Build();

app.UseRouting();
app.UseCors("AllowFrontend");
app.UseAuthorization();
app.MapControllers();
app.Run();
