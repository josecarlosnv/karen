using BL;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using ML.Specialist;
using System.Security.Claims;

namespace API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class SecSpecialistController : Controller
    {
        private readonly SpecialistBL _service;

        public SecSpecialistController(SpecialistBL service)
        {
            _service = service;
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
        [HttpGet("user/email")]
        public IActionResult GetCurrentUserEmail()
        {
            var email = GetUserEmail();

            if (string.IsNullOrEmpty(email))
                return BadRequest("Email not found");

            return Ok(new { email });
        }
        [HttpGet("GetAll")]
        public async Task<IActionResult> GetAll()
        {
            var email = GetUserEmail();

            var result = await _service.GetAll(email);

            if (!result.Correct)
                return BadRequest(result);

            return Ok(result);
        }
        private string? GetBU(){
            return User.FindFirst("BU")?.Value;
        }
        [HttpGet("GetAllAhoraEsPersonal")]
        public async Task<IActionResult> GetAllIIAhoraEsPersonal()
        {
            var email = GetUserEmail();
            var bu = GetBU(); 
            var result = await _service.GetAllAhoraEsPersonal(email,bu);

            if (!result.Correct)
                return BadRequest(result);

            return Ok(result);
        }
        
        [HttpPost("confirmation/{p8Id}")]
        public IActionResult Save([FromRoute]Guid p8Id, [FromBody] SpecialistConfirmationDTO dto)
        {

            dto.P8Id = p8Id.ToString();

            var userEmail = GetUserEmail();

            var result = _service.SaveSpecialistConfirmation(p8Id, dto, userEmail);

            if (result.Correct)
                return Ok(result);

            return BadRequest(result);
        }
        [HttpPost("BreakDown/{p8Id}")]
        public IActionResult SaveBreakDown([FromRoute]Guid p8Id, [FromBody] SpecialistBreakdownBatchDTO dto)
        {

            dto.P8Id = p8Id;

            var userEmail = GetUserEmail();

            var result = _service.SaveSpecialistBreakdownBatch(p8Id, dto, userEmail);

            if (result.Correct)
                return Ok(result);

            return BadRequest(result);
        }
        [HttpGet("GetSpecialistRate")]
        public IActionResult GetSpecialistRate()
        {
            var result = _service.GetSpecialistRate();

            return Ok(result);
        }

    }
}
