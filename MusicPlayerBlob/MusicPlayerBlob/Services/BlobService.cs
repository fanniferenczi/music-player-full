using Azure.Storage.Blobs;
using Azure.Storage.Blobs.Models;
using MusicPlayerBlob.Models;

namespace MusicPlayerBlob.Services
{
    public class BlobService:IBlobService
    {
        private readonly BlobServiceClient _blobServiceClient;
        public BlobService( BlobServiceClient blobServiceClient)
        {
            _blobServiceClient = blobServiceClient;
        }
        public async Task Upload(FileModel model,string containerName)
        {
            var containerClient = _blobServiceClient.GetBlobContainerClient(containerName);
            var blobClient= containerClient.GetBlobClient(model.SongFile.FileName);

            await blobClient.UploadAsync(model.SongFile.OpenReadStream());

        }

        public async Task<byte[]> Read(string fileName, string containerName)
        {
            var containerClient = _blobServiceClient.GetBlobContainerClient(containerName);
            var blobClient = containerClient.GetBlobClient(fileName);

            var songDownloaded = await blobClient.DownloadAsync();  //ez egy stram of data

            using (MemoryStream ms = new MemoryStream())
            {
                await songDownloaded.Value.Content.CopyToAsync(ms);  //a memorystream object-ünkbe másoljuk a responsban kapott data stream-et
                return ms.ToArray();
            }
        }

        public async Task<string> GetBlob(string fileName, string containerName)
        {
            var containerClient = _blobServiceClient.GetBlobContainerClient(containerName);
            var blobClient = containerClient.GetBlobClient(fileName);
            return blobClient.Uri.AbsoluteUri;
        }

        public async Task<IEnumerable<string>> AllBlobs(string containerName)
        {
            //acces to the container -> allow us to acces the data inside the container
            var containerClient = _blobServiceClient.GetBlobContainerClient(containerName);
            var blobs = containerClient.GetBlobsAsync();
            var files = new List<string>();
            await foreach (var item in blobs)
            {
                files.Add(item.Name);
            }
            return files;
        }
    }
}
