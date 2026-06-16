using PurchaseAPI.Repositories;
using PurchaseAPI.Services;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddCors(options =>
{
    options.AddPolicy("AngularPolicy", policy =>
    {
        policy
            .WithOrigins("http://localhost:4200")
            .AllowAnyHeader()
            .AllowAnyMethod();
    });
});
builder.Services.AddControllers();
builder.Services.AddScoped<PurchaseRepository>();
builder.Services.AddScoped<PurchaseService>();
builder.Services.AddScoped<LookupRepository>();
builder.Services.AddScoped<LookupService>();
builder.Services.AddOpenApi();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.MapSwagger();
    app.MapSwaggerUI();
}

app.UseCors("AngularPolicy");
app.UseHttpsRedirection();
app.MapControllers();

app.Run();