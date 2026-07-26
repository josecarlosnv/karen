using BL;
using Microsoft.AspNetCore.Mvc;
using ML;


namespace API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class SubOtherFunctionsController : ControllerBase
    {
        private readonly SubOtherFunctionsBL _bl;

        public SubOtherFunctionsController(SubOtherFunctionsBL bl)
        {
            _bl = bl;
        }

        [HttpPost("otherFuntion")]
        public async Task<IActionResult> Create(
            [FromBody] SubOtherFunctionsML model)
        {
            var result = await _bl.Insert(model);

            if (!result)
                return BadRequest("No se pudo insertar el registro.");

            return Ok(new
            {
                success = true,
                message = "Registro creado correctamente."
            });
        }

        [HttpGet("otherFuntionBy{createBy}")]
        public async Task<IActionResult> Get(string createBy)
        {
            var result = await _bl.GetByCreateBy(createBy);

            return Ok(result);
        }
    }
}

