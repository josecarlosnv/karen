//////////  PROGRAM PARA PRUEBAS LOCALES  (activo)
using API.Services.Security;
using BL;
using DL;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Negotiate;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddCors(options =>
{
    options.AddPolicy("FrontPolicy", policy =>
    {
policy.WithOrigins(
    "http://localhost",
    "http://localhost:5173",
    "http://localhost:5174",
    "http://localhost:4175",
    "http://mxmexapp295:8085"   // 👈 nuevo
)
.AllowAnyHeader()
.AllowAnyMethod()
.AllowCredentials();

    });
});

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddAuthentication(NegotiateDefaults.AuthenticationScheme).AddNegotiate();
builder.Services.AddAuthorization(options =>
{
    options.FallbackPolicy = options.DefaultPolicy;
});

builder.Services.AddDbContext<LeadershipQmContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

builder.Services.AddScoped<IClaimsTransformation, QmClaimsTransformer>();
builder.Services.AddScoped<ILqmSecurityBL, LqmSecurityBL>();
builder.Services.AddScoped<ILqmPerformanceBL, LqmPerformanceBL>();
builder.Services.AddScoped<ILqmQualificationsBL, LqmQualificationsBL>();


var app = builder.Build();

app.UseCors("FrontPolicy");

app.Use(async (context, next) =>
{
    if (context.Request.Method == "OPTIONS")
    {
        context.Response.StatusCode = 200;
        await context.Response.CompleteAsync();
        return;
    }
    await next();
});

app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();
app.Run();


////////  PROGRAM PARA SERVIDOR (DEV) 
/*
using API.Services.Security;
using BL;
using DL;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Negotiate;
using Microsoft.AspNetCore.Server.IISIntegration;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddCors(options =>
{
   options.AddPolicy("FrontPolicy", policy =>
   {
       policy.WithOrigins(
           "http://localhost",
           "http://mxmexapp295:8085",      // front Intelligence Studio en dev
           "http://mxmexapp295/IntelligenceStudio",
           "http://mxmexapp295"

       )
       .AllowAnyHeader()
       .AllowAnyMethod()
       .AllowCredentials();

   });
});

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// IIS maneja el Windows Auth (igual que Scorefy/PVIII en servidor)
builder.Services.AddAuthentication(options =>
{
   options.DefaultAuthenticateScheme = IISDefaults.AuthenticationScheme;
});
builder.Services.AddAuthorization(options =>
{
   options.FallbackPolicy = options.DefaultPolicy;
});

builder.Services.AddDbContext<LeadershipQmContext>(options =>
   options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

builder.Services.AddScoped<IClaimsTransformation, QmClaimsTransformer>();
builder.Services.AddScoped<ILqmSecurityBL, LqmSecurityBL>();
builder.Services.AddScoped<ILqmPerformanceBL, LqmPerformanceBL>();
builder.Services.AddScoped<ILqmQualificationsBL, LqmQualificationsBL>();


var app = builder.Build();

app.UseCors("FrontPolicy");

app.Use(async (context, next) =>
{
   if (context.Request.Method == "OPTIONS")
   {
       context.Response.StatusCode = 200;
       await context.Response.CompleteAsync();
       return;
   }
   await next();
});

app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();
app.Run();
*/