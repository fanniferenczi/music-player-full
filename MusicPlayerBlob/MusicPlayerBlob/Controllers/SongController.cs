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
        [HttpPost]
        [Route("upload")]
        public async Task<IActionResult> Upload([FromForm] FileModel model)
        {
            if(model.SongFile != null)
            {
                await _blobService.Upload(model, "musiclibrary");
            }
            return Ok();
        }
        [HttpGet]
        [Route("{fileName}")]
        public async Task<IActionResult> Read(string fileName)
        {
            var songData = await _blobService.Read(fileName, "musiclibrary");
            return File(songData, "audio/mpeg");
        }

      [HttpGet]
      [Route("get/{fileName}")]
      public async Task<IActionResult> Get(string fileName)
        {
            return Ok(await _blobService.GetBlob(fileName, "musiclibrary"));
        }

        [HttpGet]  //getting all the blobs
        [Route("getAll")]
        public async Task<IActionResult> Index()
        {
           return Ok(await _blobService.AllBlobs("musiclibrary"));

        }
    }
}
