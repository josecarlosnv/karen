//////////////////program para Pruebas locales 

//using API.Services.Security;
//using BL;
//using DL;
//using Microsoft.AspNetCore.Authentication;
//using Microsoft.AspNetCore.Authentication.Negotiate;
//using Microsoft.EntityFrameworkCore;
//using ML;

//var builder = WebApplication.CreateBuilder(args);

//builder.Services.AddControllers();
//builder.Services.AddMemoryCache();

//builder.Services.AddPooledDbContextFactory<MexItaStaBiAuditContext>(options =>
//   options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

//builder.Services.AddScoped<MexItaStaBiAuditContext>(sp =>
//   sp.GetRequiredService<IDbContextFactory<MexItaStaBiAuditContext>>().CreateDbContext());


//builder.Services.AddScoped<EntityBL>();
//builder.Services.AddScoped<CatalogoSegmento>();
//builder.Services.AddScoped<P8GeneralesBL>();
//builder.Services.AddScoped<Pviii>();
//builder.Services.AddScoped<CatalogoIndustria>();
//builder.Services.AddScoped<AuditWorkFlow>();
//builder.Services.AddScoped<NatureBL>();
//builder.Services.AddScoped<LSQCR_EQCRBL>();
//builder.Services.AddScoped<EngagementSegmentBL>();
//builder.Services.AddScoped<ReportTypeBL>();
//builder.Services.AddScoped<TasasBuBL>();
//builder.Services.AddScoped<RiskLevelBL>();
//builder.Services.AddScoped<SpecialistBL>();
//builder.Services.AddScoped<pviiiCatAuditStageMthBL>();
//builder.Services.AddScoped<SuggestedCollaboratordBL>();
//builder.Services.AddScoped<CatalogoServiceLine>();
//builder.Services.AddScoped<CatSpecialistBL>();
//builder.Services.AddScoped<ApprovalsBL>();
//builder.Services.AddScoped<CountryBL>();
//builder.Services.AddScoped<ReviewBL>();
//builder.Services.AddScoped<ApprovalsBL>();

//builder.Services.AddScoped<SubOtherFunctionsBL>();
//builder.Services.AddTransient<SubOtherFunctionsBL>();

//builder.Services.AddScoped<ApprovalsClaimsTransformer>();
//builder.Services.AddScoped<IApprovalAccessRepository, ApprovalAccessRepository>();
//builder.Services.AddCors(options =>
//{
//   options.AddPolicy("AllowFrontend", policy =>
//   {
//       policy
//           .WithOrigins("http://localhost:5173")
//           .AllowAnyHeader()
//           .AllowAnyMethod()
//           .AllowCredentials();
//   });
//});
//builder.Services.AddScoped<IEntityService, EntityBL>();
//builder.Services.AddScoped<IClaimsTransformation, P8ClaimsTransformer>();
//builder.Services.AddEndpointsApiExplorer();
//builder.Services.AddSwaggerGen();
//builder.Services.AddAuthentication(NegotiateDefaults.AuthenticationScheme)
//  .AddNegotiate();
//builder.Configuration
//   .AddJsonFile("appsettings.json")
//   .AddJsonFile($"appsettings.{builder.Environment.EnvironmentName}.json", true);
//builder.Services.AddAuthorization(options =>
//{
//   options.FallbackPolicy = options.DefaultPolicy;
//});
//builder.Services.AddAuthorization();
//builder.Logging.ClearProviders();
//builder.Logging.AddConsole();
//builder.Logging.AddProvider(new API.Logging.FileLoggerProvider(LogLevel.Information));
//var app = builder.Build();
//app.UseMiddleware<API.Middleware.RequestLoggingMiddleware>();
//app.UseSwagger();
//app.UseSwaggerUI();
//app.UseRouting();
//app.UseHttpsRedirection();
//app.UseCors("AllowFrontend");
//app.UseAuthentication();
//app.UseAuthorization();
//app.MapControllers();
//app.Run();



//program para servidor 

using API.Services.Security;
using BL;
using DL;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Negotiate;
using Microsoft.AspNetCore.Server.IISIntegration;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();
builder.Services.AddMemoryCache();

builder.Services.AddPooledDbContextFactory<MexItaStaBiAuditContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

builder.Services.AddScoped<MexItaStaBiAuditContext>(sp =>
    sp.GetRequiredService<IDbContextFactory<MexItaStaBiAuditContext>>().CreateDbContext());

builder.Services.AddDbContextPool<MexItaStaBiAuditContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));
builder.Services.AddScoped<IEntityService, EntityBL>();
builder.Services.AddScoped<CatalogoSegmento>();
builder.Services.AddScoped<P8GeneralesBL>();
builder.Services.AddScoped<Pviii>();
builder.Services.AddScoped<CatalogoIndustria>();
builder.Services.AddScoped<AuditWorkFlow>();
builder.Services.AddScoped<ApprovalsClaimsTransformer>();
builder.Services.AddScoped<NatureBL>();
builder.Services.AddScoped<pviiiCatAuditStageMthBL>();
builder.Services.AddScoped<LSQCR_EQCRBL>();
builder.Services.AddScoped<EngagementSegmentBL>();
builder.Services.AddScoped<ReportTypeBL>();
builder.Services.AddScoped<TasasBuBL>();
builder.Services.AddScoped<SuggestedCollaboratordBL>();
builder.Services.AddScoped<CatalogoServiceLine>();
builder.Services.AddScoped<CatSpecialistBL>();
builder.Services.AddScoped<ApprovalsBL>();
builder.Services.AddScoped<CountryBL>();
builder.Services.AddScoped<SpecialistBL>();
builder.Services.AddScoped<ReviewBL>();
builder.Services.AddScoped<RiskLevelBL>();
builder.Services.AddScoped<IClaimsTransformation, P8ClaimsTransformer>();

builder.Services.AddScoped<IApprovalAccessRepository, ApprovalAccessRepository>();
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
 
builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = IISDefaults.AuthenticationScheme;
});
builder.Services.AddAuthorization(options =>
{
    options.FallbackPolicy = options.DefaultPolicy;
});
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Logging.ClearProviders();
builder.Logging.AddConsole();
builder.Logging.AddProvider(new API.Logging.FileLoggerProvider(LogLevel.Information));
var app = builder.Build();
app.UseMiddleware<API.Middleware.RequestLoggingMiddleware>();
app.UseSwagger();
app.UseSwaggerUI();
app.UseRouting();
app.UseHttpsRedirection();
app.UseCors("AllowFrontend");
app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();
app.Run();
