using BL;
using Microsoft.AspNetCore.Mvc;
using ML;
using System.Security.Claims;

namespace API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ApporvalsController : ControllerBase
    {
        private readonly ApprovalsBL _service;

        public ApporvalsController(ApprovalsBL service)
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

        //[HttpGet("Approvals")]
        //public async Task<IActionResult> GetAllAppAsync()
        //{
        //    var email = GetUserEmail();
        //    var result = await _service.GetAllFiltered(email);

        //    return Ok(result);
        //}

        [HttpGet("Approvals")]
        public async Task<IActionResult> GetAllAppAsync()
        {
            var email = GetUserEmail();

            var segments = User.FindAll("Segment")
                .Select(x => x.Value)
                .Distinct()
                .ToList();

            var result = await _service.GetAllFiltered(email, segments);

            return Ok(result);
        }

        [HttpGet("ReviesApproval/{p8Id}")]
        public async Task<IActionResult> ReviApproval(Guid p8Id)
        {
            var result = await _service.GetAllRevConfirm(p8Id);

            return Ok(result);

        }
       
        [HttpPost("Documentation/{p8Id}")]
        public IActionResult SaveDocumentation(Guid p8Id,
    [FromBody] ApprovalRequestDTO dto)
        {
            var email = GetUserEmail();
            var result = _service.SaveApproval(p8Id, dto, email);

            return Ok(result);
        }
        [HttpGet("Documentation/{p8Id}")]
        public IActionResult GetByIdDocumentation(Guid p8Id)
        {
            var result = _service.GetByIdDocumentation(p8Id);

            if (!result.Correct || result.Object == null)
            {
                return NotFound("Documentation not found");
            }

            return Ok(result.Object);
        }
        [HttpGet("ApprovalStatus/{p8Id}")]
        public IActionResult GetApprovalStatus(Guid p8Id)
        {
            try
            {
                var data = _service.GetApprovalStatus(p8Id.ToString());
                return Ok(data);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        //cpntrolador para returno to review 
        [HttpPost("ReturnToReview/{p8Id}")]
        public IActionResult ReturnToReview(
    Guid p8Id,
    [FromBody] ReturnToReviewDTO dto)
        {
            var userEmail = GetUserEmail();

            var result = _service.ReturnToReview(
                p8Id,
                dto,
                userEmail);

            if (!result.Correct)
                return BadRequest(result);

            return Ok(result);
        }

    }
}
