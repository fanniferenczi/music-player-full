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
       

        public async Task<string> GetBlob(string fileName, string containerName)
        {
            var containerClient = _blobServiceClient.GetBlobContainerClient(containerName);
            var blobClient = containerClient.GetBlobClient(fileName);
            return blobClient.Uri.AbsoluteUri;
        }

        public async Task<IEnumerable<string>> GetAllBlobs(string containerName)
        {
            //acces to the container -> allows to acces the data inside the container
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
