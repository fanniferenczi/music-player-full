using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using MusicPlayerBlob.Models;
using MusicPlayerBlob.Services;

namespace MusicPlayerBlob.Controllers
{
    [Route("[controller]")]
    [ApiController]
    public class SongController : ControllerBase
    {
        readonly IBlobService _blobService;
        public SongController(IBlobService blobService)
        {
            _blobService = blobService;
        }
     

      [HttpGet]  
      [Route("get/{fileName}")]
      public async Task<IActionResult> Get(string fileName)
        {
            return Ok(await _blobService.GetBlob(fileName, "musiclibrary"));
        }

        [HttpGet]  
        [Route("getAll")]
        public async Task<IActionResult> GetAll()
        {
           return Ok(await _blobService.GetAllBlobs("musiclibrary"));

        }
    }
}
