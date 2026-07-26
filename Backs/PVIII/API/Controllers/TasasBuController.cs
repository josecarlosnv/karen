using BL;
using Microsoft.AspNetCore.Mvc;
using ML;

namespace API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]

    public class TasasBuController : Controller
    {

        private readonly TasasBuBL _tasasBuBL;

        public TasasBuController(TasasBuBL tasasBuBL)
        {
            _tasasBuBL = tasasBuBL;
        }

        [HttpGet("TasasBu")]

        public ActionResult<IEnumerable<TasasBuML>> GetAll()
        {
            return Ok(_tasasBuBL.GetAll());
        }

    }
}
