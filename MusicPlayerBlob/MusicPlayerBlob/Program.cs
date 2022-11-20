using Azure.Storage.Blobs;
using MusicPlayerBlob.Services;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

//get the connection string from the appsettings
var blobConnection = builder.Configuration.GetValue<string>("AzureStorage");

//injecting the blobserviceclient 
builder.Services.AddSingleton(x => new BlobServiceClient(blobConnection));

//injecting the blobservice
builder.Services.AddSingleton<IBlobService, BlobService>();


builder.Services.AddCors((setup) =>
{
    setup.AddPolicy("default", (options) =>
    {
        options.AllowAnyMethod().AllowAnyHeader().AllowAnyOrigin();
    });
});

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseCors("default");

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.Run();
