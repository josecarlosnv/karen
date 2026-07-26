using BL;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Mvc;
using ML;
using System.Security.Claims;

[ApiController]
[Route("api/administration")]
[EnableCors("FrontPolicy")]
public class AdministrationController : ControllerBase
{
    private readonly IAdministrationBL _bl;
    private readonly ILogger<AdministrationController> _logger;

    public AdministrationController(IAdministrationBL bl, ILogger<AdministrationController> logger)
    {
        _bl = bl;
        _logger = logger;
    }

    [HttpGet("users")]
    public async Task<IActionResult> GetUsers()
    {
        try
        {
            if (!await _bl.UserIsAdminAsync(GetUserEmail()))
                return StatusCode(403, new { message = "Access denied." });
            var users = await _bl.GetUsersAsync();
            return Ok(users);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error loading users");
            return StatusCode(500, new { message = "Error cargando usuarios." });
        }
    }

    [HttpPost("users")]
    public async Task<IActionResult> CreateUser([FromBody] SecurityUserRequest req)
    {
        try
        {
            if (!await _bl.UserIsAdminAsync(GetUserEmail()))
                return StatusCode(403, new { message = "Access denied." });
            var id = await _bl.CreateUserAsync(req);
            return Ok(new { id });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error creating user");
            return StatusCode(500, new { message = "Error creando usuario." });
        }
    }

    [HttpPut("users/{id}")]
    public async Task<IActionResult> UpdateUser(int id, [FromBody] SecurityUserRequest req)
    {
        try
        {
            if (!await _bl.UserIsAdminAsync(GetUserEmail()))
                return StatusCode(403, new { message = "Access denied." });
            await _bl.UpdateUserAsync(id, req);
            return NoContent();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error updating user");
            return StatusCode(500, new { message = "Error actualizando usuario." });
        }
    }

    [HttpDelete("users/{id}")]
    public async Task<IActionResult> DeleteUser(int id)
    {
        try
        {
            if (!await _bl.UserIsAdminAsync(GetUserEmail()))
                return StatusCode(403, new { message = "Access denied." });
            await _bl.DeleteUserAsync(id);
            return NoContent();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error deleting user");
            return StatusCode(500, new { message = "Error eliminando usuario." });
        }
    }
[HttpGet("me")]
public IActionResult WhoAmI() => Ok(new { email = GetUserEmail() });

    private string GetUserEmail()
    {
        return User.FindFirst(ClaimTypes.Email)?.Value
            ?? User.FindFirst("preferred_username")?.Value
            ?? User.FindFirst("upn")?.Value
            ?? User.Identity?.Name
            ?? "noreply@local";
    }

[HttpGet("access")]
public async Task<IActionResult> CheckAccess()
{
    var email = User.FindFirst(ClaimTypes.Email)?.Value ?? "";
    var hasAccess = await _bl.UserIsAdminAsync(email);
    return Ok(new { hasAccess });
}

}
