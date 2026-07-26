////Program pruebas Servidor
 
using API.Services.Security;
using BL;
using DL;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Negotiate;
using Microsoft.AspNetCore.Server.IISIntegration;
using Microsoft.EntityFrameworkCore;
using ML;
using System.Security.Claims;
 
var builder = WebApplication.CreateBuilder(args);
 
// ✅ CORS – Scorefy + orígenes de Intelligence Studio (host:puerto, SIN rutas)
builder.Services.AddCors(options =>
{
    options.AddPolicy("FrontPolicy", policy =>
    {
        policy.WithOrigins(
            // ── localhost (desarrollo) ──
            "http://localhost",
            "http://localhost:5173",
            "http://localhost:5248",
            "http://localhost:8081",
 
            // ── mxmexapp295 (DEV) ──
            "http://mxmexapp295",
            "http://mxmexapp295:80",
            "http://mxmexapp295:5173",
            "http://mxmexapp295:5245",
            "http://mxmexapp295:5248",
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
            "http://InteligenceStudio.mx.kworld.kpmg.com",
 
    "https://intelligencestudio.mx.kworld.kpmg.com/IntelligenceStudio/",
    "https://Intelligencestudio.mx.kworld.kpmg.com/IntelligenceStudio/",
    "https://intelligencestudio.mx.kworld.kpmg.com/IntelligenceStudio/scorefy",
    "https://Intelligencestudio.mx.kworld.kpmg.com/IntelligenceStudio/scorefy",
 
            // ── Scorefy (FQDN propio, por si aplica) ──
            "https://scorefy.mx.kworld.kpmg.com",
            "https://scorefy.mx.kworld.kpmg.com:8443"
            )
            .AllowAnyHeader()
            .AllowAnyMethod()
            .AllowCredentials();
    });
});
 
builder.Services.AddControllers();
 
builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = IISDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme    = IISDefaults.AuthenticationScheme;   // ← faltaba este
});

 
builder.Services.AddAuthorization(options =>
{
    options.FallbackPolicy = options.DefaultPolicy;
});
 
builder.Services.AddDbContext<MexItaStaBiAuditContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));
 
builder.Services.AddScoped<IClaimsTransformation, ScorefyClaimsTransformer>();
builder.Services.AddScoped<ISelfEvaluationsBL, SelfEvaluationsBL>();
builder.Services.AddScoped<IManagerEvaluationsBL, ManagerEvaluationsBL>();
builder.Services.AddScoped<IDashboardBL, DashboardBL>();
builder.Services.AddScoped<IStatusReminderBL, StatusReminderBL>();
builder.Services.AddScoped<IFinalConclusionBL, FinalConclusionBL>();
builder.Services.AddScoped<IPersonalProfileBL, PersonalProfileBL>();
builder.Services.AddScoped<ISecurityBL, SecurityBL>();
builder.Services.AddScoped<ISecurityDirectoryBL, SecurityDirectoryBL>();
builder.Services.AddScoped<IAdministrationBL, AdministrationBL>();
 
var app = builder.Build();
 
app.UseRouting();
 
app.UseCors("FrontPolicy");       // primero CORS: agrega los headers
 
app.Use(async (context, next) =>  // preflight OPTIONS, ya con headers puestos
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

//Program Pruebas Locales

// using API.Services.Security;
// using BL;
// using DL;
// using Microsoft.AspNetCore.Authentication;
// using Microsoft.AspNetCore.Authentication.Negotiate;
// using Microsoft.EntityFrameworkCore;
// using Microsoft.VisualStudio.Web.CodeGenerators.Mvc.Templates.BlazorIdentity.Pages.Manage;
// using ML;

// var builder = WebApplication.CreateBuilder(args);


// builder.Services.AddCors(options =>
// {
//     options.AddPolicy("FrontPolicy", policy =>
//     {
//         policy.WithOrigins( 
//             "http://mxmexapp295",
//             "http://mxmexapp295/Scorefy_Test",
//             "http://mxmexapp295:8080",
//             "http://localhost",
//             "http://localhost:5173",
//             "http://localhost:5174",
//             "http://localhost:5248"

//             )
//             .AllowAnyHeader()
//             .AllowAnyMethod()
//             .AllowCredentials();

//     });
// });


// builder.Services.AddEndpointsApiExplorer();
// builder.Services.AddSwaggerGen();

// // Add services to the container.
// builder.Services.AddControllers();

// builder.Services.AddOpenApi();

// builder.Services.AddAuthentication(NegotiateDefaults.AuthenticationScheme)
//    .AddNegotiate();

// builder.Services.AddAuthorization(options =>
// {
//     // By default, all incoming requests will be authorized according to the default policy.
//     options.FallbackPolicy = options.DefaultPolicy;
// });

// builder.Services.AddDbContext<MexItaStaBiAuditContext>(options =>
//     options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));


// builder.Services.AddScoped<IClaimsTransformation, ScorefyClaimsTransformer>();

// //var origenesPermitidos = builder.Configuration.GetSection("origenesPermitidos").Get<string[]>()!;
// builder.Services.AddScoped<ISelfEvaluationsBL, SelfEvaluationsBL>();
// builder.Services.AddScoped<IManagerEvaluationsBL, ManagerEvaluationsBL>();
// builder.Services.AddScoped<IDashboardBL, DashboardBL>();
// builder.Services.AddScoped<IStatusReminderBL, StatusReminderBL>();
// builder.Services.AddScoped<IFinalConclusionBL, FinalConclusionBL>();
// builder.Services.AddScoped<IPersonalProfileBL, PersonalProfileBL>();
// //para el icono de usuario en header
// builder.Services.AddScoped<IPersonalProfileBL, PersonalProfileBL>();
// builder.Services.AddScoped<ISecurityBL, SecurityBL>();
// builder.Services.AddScoped<ISecurityDirectoryBL, SecurityDirectoryBL>();
// builder.Services.AddScoped<IAdministrationBL, AdministrationBL>();

// var app = builder.Build();

// app.UseCors("FrontPolicy");      // ← primero, agrega los headers

// app.Use(async (context, next) => // ← después, ya con headers puestos
// {
//     if (context.Request.Method == "OPTIONS")
//     {
//         context.Response.StatusCode = 200;
//         await context.Response.CompleteAsync();
//         return;
//     }
//     await next();
// });

// app.UseAuthentication();
// app.UseAuthorization();
// app.MapControllers();
// app.Run();
