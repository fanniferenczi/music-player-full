using MusicPlayerBlob.Models;

namespace MusicPlayerBlob.Services
{
    public interface IBlobService
    {
        
        Task<string> GetBlob(string fileName, string containerName);
        Task<IEnumerable<string>> GetAllBlobs(string containerName);
    }
}
