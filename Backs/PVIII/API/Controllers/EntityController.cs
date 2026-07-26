using BL;
using DL;
using Microsoft.AspNetCore.Mvc;
using ML;
using System.Security.Claims;
using static BL.EntityBL;

namespace API.Controllers
{

    [Route("api/[controller]")]
    [ApiController]
    public class EntityController : ControllerBase
    {
        private readonly IEntityService _entityService;
      
        public EntityController(IEntityService entityService)
        {
            _entityService = entityService;
        }

        private string GetUserEmail()
        {
            var email =
                User.FindFirst(ClaimTypes.Email)?.Value ??
                User.FindFirst("preferred_username")?.Value ??
                User.FindFirst("upn")?.Value ??
                User.Identity?.Name;

            if (!string.IsNullOrWhiteSpace(email) && email.Contains("\\"))
            {
                var username = email.Split("\\")[1];
                email = $"{username}@kpmg.com.mx";
            }

            return email ?? "noreply@local";
        }

       [HttpGet("search")]
            public async Task<IActionResult> Search([FromQuery] string query)
            {
                var result = await _entityService.SearchAsync(query);
                return Ok(result);
            }
       
        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(long id)
        {
            var result = await _entityService.GetByIdEntity(id);
            Console.WriteLine($"Entity search for {id}: {(result == null ? "NOT FOUND" : "FOUND")}");
            if (result == null)
                return NotFound();

            return Ok(result);
        }
        [HttpPost]
        public async Task<IActionResult> Create([FromBody] EntityModel model)
        {
            if (model == null)
                return BadRequest("Invalid client");
            var UserEmail = GetUserEmail();

            var result = await _entityService.CreateEntityAsync(model,UserEmail);

            if (!result)
                return BadRequest("Could not create client");

            return Ok(new { message = "Client created successfully" });
        }

        [HttpGet("partners")]
        public async Task<IActionResult> GetPartners()
        {
            return Ok(await _entityService.GetPartnersAsync());
        }

        [HttpGet("managers")]
        public async Task<IActionResult> GetManagers()
        {
            return Ok(await _entityService.GetManagersAsync());
        }
        [HttpGet("comisario")]
        public async Task<IActionResult> GetPartnersComisario()
        {
            return Ok(await _entityService.GetPartnersComisario());
        }
        [HttpGet("EstadisticasTeamLeaders")]
        public async Task<IActionResult> EstadisticasTeamLeaders()
        {
            return Ok(await _entityService.GetEstadisticasTeamLeadersAsync());
        }
        [HttpGet("Office")]
        public async Task<IActionResult> GetOffices()
        {
            var result = await _entityService.GetOfficesAsync();

            var mapped = result.Select(x => new {
                id = x.OficinaId.ToString(),
                name = x.Oficina
            });

            return Ok(mapped);
        }
    }

}
