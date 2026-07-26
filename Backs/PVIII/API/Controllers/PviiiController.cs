using BL;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ML;
using ML.Pviii;
using System.Security.Claims;
using System.Text.Json;

namespace API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PviiiController : ControllerBase
    {
        private readonly Pviii _service;

        public PviiiController(Pviii service)
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

        // ===========================================================
        // CREATE PROJECT
        // ===========================================================
        [HttpPost("create")]
        public IActionResult CreateProject([FromBody] CreateProjectDto dto)
        {
            dto.CreatedByUserEmail = GetUserEmail();
            var result = _service.CreateProject(dto);
            if (!result.Correct)
            {
                return BadRequest(new
                {
                    correct = false,
                    errorMessage = result.ErrorMessage
                });
            }

            return Ok(new
            {
                correct = true,
                Object = result.Object
            });
        }

        //=================================
        // 1.1 FRAMEWORK
        //=================================

        [HttpGet("framework/{p8Id}")]
        public IActionResult GetFramework([FromRoute(Name = "p8Id")] Guid p8Id)
        {
            var result = _service.GetFramework(p8Id);

            if (!result.Correct)
                return BadRequest(result);

            return Ok(result);
        }

        // ============================================================
        //  Guardar/Actualizar Framework
        // ============================================================
        [HttpPost("framework/{p8Id}")]
        public IActionResult SaveFramework(Guid p8Id, [FromBody] FrameworkDto dto)
        {
            if (p8Id == Guid.Empty)
                return BadRequest("El P8Id no puede ser vacío.");

            if (dto == null)
                return BadRequest("El body está vacío.");

            dto.P8Id = p8Id;
            var email = GetUserEmail();

            var result = _service.SaveFramework(p8Id, dto,email);

            if (!result.Correct)
                return BadRequest(result);

            return Ok(result);
        }

        //=================================
        // 1.2 DETAILS
        //=================================
        [HttpPut("general-data/{p8Id}/engagement-details")]
        public IActionResult UpdateEngagementDetails(Guid p8Id, [FromBody] EngagementDetailsDto dto)
        {
            var email = GetUserEmail();


            var result = _service.UpdateEngagementDetails(p8Id, dto,email);
            if (!result.Correct)
                return BadRequest(result);

            return Ok(result);
        }


        // ============================================
        // PUT: api/quality/{p8Id}
        // ============================================
        [HttpPut("quality/{p8Id}")]
        public IActionResult UpdateQuality(Guid p8Id, [FromBody] QualityDto dto)
        {
            if (dto == null)
                return BadRequest("No se recibió información.");
            var email = GetUserEmail();


            var result = _service.UpdateQuality(p8Id, dto,email);

            if (result.Correct)
                return Ok(new
                {
                    success = true,
                    message = "Quality actualizado correctamente."
                });

            return BadRequest(new
            {
                success = false,
                error = result.ErrorMessage
            });
        }

        // ===========================================================
        //  3. Entities
        // ===========================================================
        [HttpGet("search")]
        public async Task<IActionResult> Search(
             [FromQuery] string? query,
             [FromQuery] int page = 1,
             [FromQuery] int pageSize = 20)
        {
            var result = await _service.SearchAsync(query, page, pageSize);
            return Ok(result);
        }
        [RequestSizeLimit(100_000_000)]
        [HttpPut("entities/{p8Id}")]
        public IActionResult UpdateEngagementConfiguration(Guid p8Id, [FromBody] SaveClientConfigurationDto dto)
        {

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (dto == null)
                return BadRequest(new
                {
                    success = false,
                    error = "No se recibió información."
                });

            var email = GetUserEmail();

            var result = _service.SaveEngagementConfiguration(p8Id.ToString(), dto,email);

            if (result.Correct)
            {
                return Ok(new
                {
                    success = true,
                    message = "Configuración de engagement actualizada correctamente.",
                    data = result.Object
                });
            }

            return BadRequest(new
            {
                success = false,
                error = result.ErrorMessage
            });
        }


        // ===========================================================
        //  4. STAFFING
        // ===========================================================

        [HttpPut("staffing/{p8Id}")]
        public IActionResult SaveStaffing(
    Guid p8Id,
    [FromBody] JsonElement body)
        {
            try
            {
                var cutoffDate = body.GetProperty("cutoffDate").GetDateTime();

                var staffingDtos = new List<StaffingDto>();

                foreach (var item in body.GetProperty("dtos").EnumerateArray())
                {
                    staffingDtos.Add(new StaffingDto
                    {
                        KeyId = item.GetProperty("keyId").GetInt32(),
                        StartDate = DateOnly.Parse(item.GetProperty("startDate").GetString()!),
                        EndDate = DateOnly.Parse(item.GetProperty("endDate").GetString()!),
                        LevelLabel = item.GetProperty("levelLabel").GetString()!,
                        PeopleCount = item.GetProperty("peopleCount").GetInt32(),
                        EngagementSegmentId = item.GetProperty("engagementSegmentId").GetInt32(),
                        EngagementSegmentLabel = item.GetProperty("engagementSegmentLabel").GetString()!,
                        CostCenter = item.GetProperty("costCenter").ValueKind == JsonValueKind.Null
                            ? null
                            : item.GetProperty("costCenter").GetInt32(),
                    });
                }

                var schedulingJson = body.GetProperty("schedulingDto");

                var schedulingDto = new SchedulingConsiderationDto
                {
                    TravelRequired = schedulingJson.GetProperty("travelRequired").GetBoolean(),
                    SchedulingNotes = schedulingJson.GetProperty("schedulingNotes").GetString(),
                    EngagementSegmentId = schedulingJson.GetProperty("engagementSegmentId").GetInt32(),
                    EngagementSegmentLabel = schedulingJson.GetProperty("engagementSegmentLabel").GetString(),
                    SuggestedCollaborators = schedulingJson.TryGetProperty("suggestedCollaborators", out var sc)
                        ? sc.EnumerateArray()
                            .Select(x => new SuggestedCollaboratorDto
                            {
                                SuggestedEmployeeId = x.GetProperty("suggestedEmployeeId").GetInt32(),
                                SuggestedEmployeeName = x.GetProperty("suggestedEmployeeName").GetString()!
                            }).ToList()
                        : new List<SuggestedCollaboratorDto>()
                };

                var email = GetUserEmail();
                var result = _service.SaveStaffing(
                    p8Id,
                    cutoffDate,
                    staffingDtos,
                    schedulingDto,
                    email
                );

                return result.Correct ? Ok(result) : BadRequest(result);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }


        [HttpPost("staffing/calculate")]
public IActionResult Calculate([FromBody] List<StaffingDto> dtos)
{
    try
    {
        var result = _service.CalculateStaffingPreview(dtos);
        return Ok(result);
    }
    catch (ApplicationException ex)
    {
        return BadRequest(new { message = ex.Message });
    }
}
        // ===========================================================
        //  5. SPECIALISTS
        // ===========================================================

        [HttpPut("specialists/{p8Id:guid}")]
        public IActionResult UpsertSpecialists(
    Guid p8Id,
    [FromBody] List<SpecialistsDto> specialists)
        {


            var userEmail = GetUserEmail();

            if (string.IsNullOrEmpty(userEmail))
                return Unauthorized("No se pudo determinar el usuario.");

            var result = _service.UpsertSpecialists(p8Id, specialists, userEmail);

            return result.Correct
                ? Ok(result)
                : BadRequest(result);
        }
        // ===========================================================
        //  6. VALUATION
        // ===========================================================
        [HttpPut("valuation/{p8Id}")]
        public IActionResult UpdateProjectValuation(
            Guid p8Id,
            [FromBody] ML.Pviii.ValuationDto dto)
        {
            var email = GetUserEmail();

            var result = _service.UpdateProjectValuation(p8Id, dto,email);
            return result.Correct ? Ok(result) : BadRequest(result);
        }

        // ===========================================================
        //  6.1 VALUATION break 
        // ===========================================================
        [HttpGet("vwValuationByP8/{p8Id}")]
        public async Task<IActionResult> vwValuationBreakByIDP8(string p8Id)
        {
            var result = await _service.vwValuationBreakByIDP8(p8Id);

            if (result == null)
                return NotFound();

            return Ok(result);
        }
        // ===========================================================
        //  6.7 Review
        // ===========================================================
        [HttpPost("review/{p8Id}")]
        public async Task<IActionResult> SubmitReview(
    Guid p8Id,
    [FromBody] SubmitReviewDto dto)
        {
            var email = GetUserEmail();
            
            if (dto.P8Id != p8Id.ToString())
                return BadRequest("P8Id mismatch.");

            var result = await _service.SaveReview(dto, email);

            return result.Correct
                ? Ok(result)
                : BadRequest(result);
        }

        // ===========================================================
        //  7. SUBMIT PROJECT
        // ===========================================================
        [HttpPut("submit/{p8Id}")]
        public IActionResult SubmitProject(Guid p8Id, [FromBody] SubmitDto dto)
        {
            var email = GetUserEmail();

            var result = _service.SubmitProject(p8Id, dto,email);
            return result.Correct ? Ok(result) : BadRequest(result);
        }


        // ===========================================================
        // 8. GET PROJECT DETAIL
        // ===========================================================
        [HttpGet("detail/{p8Id}")]
        public async Task<IActionResult> GetProjectDetail(Guid p8Id)
        {
            var result = await _service.GetProjectDetail(p8Id);
            return result.Correct ? Ok(result.Object) : BadRequest(result);
        }
    }
}