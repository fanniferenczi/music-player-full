using MusicPlayerBlob.Models;

namespace MusicPlayerBlob.Services
{
    public interface IBlobService
    {
        Task Upload(FileModel model, string containerName);
        Task<byte[]> Read(string fileName, string containerName);
        Task<string> GetBlob(string fileName, string containerName);
        Task<IEnumerable<string>> AllBlobs(string containerName);
    }
}
