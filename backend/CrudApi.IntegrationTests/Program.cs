using System.Net;
using System.Net.Http.Json;
using CrudApi.Data;
using CrudApi.Dtos;
using CrudApi.Models;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.Data.Sqlite;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.DependencyInjection.Extensions;
using Microsoft.Extensions.Logging;

internal static class AuthIntegrationTests
{
public static async Task Main()
{
using var connection = new SqliteConnection("Data Source=:memory:");
connection.Open();
await using var factory = new WebApplicationFactory<Program>().WithWebHostBuilder(builder =>
{
    builder.UseContentRoot(Path.GetFullPath(Path.Combine(AppContext.BaseDirectory, "../../../../CrudApi")));
    builder.ConfigureLogging(logging => logging.ClearProviders());
    builder.ConfigureServices(services =>
    {
        services.RemoveAll<DbContextOptions<AppDbContext>>();
        services.RemoveAll<IDbContextOptionsConfiguration<AppDbContext>>();
        services.AddDbContext<AppDbContext>(options => options.UseSqlite(connection));
    });
});
using (var scope = factory.Services.CreateScope())
    await scope.ServiceProvider.GetRequiredService<AppDbContext>().Database.EnsureCreatedAsync();

using var client = factory.CreateClient(new WebApplicationFactoryClientOptions
{
    BaseAddress = new Uri("https://localhost"), AllowAutoRedirect = false
});
var checks = 0;
void Check(bool success, string description)
{
    if (!success) throw new Exception($"FAIL: {description}");
    checks++;
    Console.WriteLine($"PASS: {description}");
}
async Task Status(HttpResponseMessage response, HttpStatusCode expected, string description)
{
    var body = await response.Content.ReadAsStringAsync();
    Check(response.StatusCode == expected, $"{description} ({(int)response.StatusCode}): {body}");
}
object Credentials(string email = "student@example.com", string password = "Correct password 123!") => new { email, password };
await Status(await client.GetAsync("/api/auth/me"), HttpStatusCode.Unauthorized, "Anonymous session rejected");
await Status(await client.PostAsJsonAsync("/api/auth/register", Credentials("bad-email")), HttpStatusCode.BadRequest, "Invalid email rejected");
await Status(await client.PostAsJsonAsync("/api/auth/register", Credentials(password: "short")), HttpStatusCode.BadRequest, "Short password rejected");
await Status(await client.PostAsJsonAsync("/api/auth/register", Credentials(password: new string('x', 129))), HttpStatusCode.BadRequest, "Oversized password rejected");
await Status(await client.PostAsJsonAsync("/api/auth/register", new { email = "student@example.com" }), HttpStatusCode.BadRequest, "Missing password rejected");
var registration = await client.PostAsJsonAsync("/api/auth/register", Credentials());
await Status(registration, HttpStatusCode.Created, "Registration succeeds");
Check(!(await registration.Content.ReadAsStringAsync()).Contains("password", StringComparison.OrdinalIgnoreCase), "Registration never exposes password hash");
await Status(await client.GetAsync("/api/auth/me"), HttpStatusCode.Unauthorized, "Registration requires subsequent login");
await Status(await client.PostAsJsonAsync("/api/auth/register", Credentials("STUDENT@example.com")), HttpStatusCode.Conflict, "Case-insensitive duplicate rejected");
using (var scope = factory.Services.CreateScope())
{
    var services = scope.ServiceProvider;
    var db = services.GetRequiredService<AppDbContext>();
    var user = await db.Users.SingleAsync();
    Check(user.PasswordHash != "Correct password 123!" &&
        services.GetRequiredService<IPasswordHasher<User>>().VerifyHashedPassword(user, user.PasswordHash, "Correct password 123!") != PasswordVerificationResult.Failed,
        "Database stores a verifiable password hash");
    db.Users.Add(new User { Email = "STUDENT@example.com", NormalizedEmail = user.NormalizedEmail, PasswordHash = "unused" });
    try { await db.SaveChangesAsync(); throw new Exception("Duplicate database insert succeeded"); }
    catch (DbUpdateException) { Check(true, "Database unique index prevents duplicate emails"); }
}
var wrong = await client.PostAsJsonAsync("/api/auth/login", Credentials(password: "Wrong password 123!"));
await Status(wrong, HttpStatusCode.Unauthorized, "Wrong password rejected");
var unknown = await client.PostAsJsonAsync("/api/auth/login", Credentials("unknown@example.com"));
await Status(unknown, HttpStatusCode.Unauthorized, "Unknown user rejected");
Check(await wrong.Content.ReadAsStringAsync() == await unknown.Content.ReadAsStringAsync(), "Login errors do not disclose account existence");
var login = await client.PostAsJsonAsync("/api/auth/login", Credentials(" STUDENT@example.com "));
await Status(login, HttpStatusCode.OK, "Login normalizes email and checks persisted user");
var cookie = login.Headers.GetValues("Set-Cookie").Single();
Check(cookie.Contains("httponly", StringComparison.OrdinalIgnoreCase) && cookie.Contains("samesite=strict", StringComparison.OrdinalIgnoreCase) && cookie.Contains("secure", StringComparison.OrdinalIgnoreCase), "HTTPS session cookie security attributes");
var me = await client.GetFromJsonAsync<UserResponse>("/api/auth/me");
Check(me?.Email == "student@example.com", "Authenticated profile loaded from database");
using var reloadedClient = factory.CreateClient(new WebApplicationFactoryClientOptions { BaseAddress = new Uri("https://localhost") });
reloadedClient.DefaultRequestHeaders.Add("Cookie", cookie.Split(';')[0]);
await Status(await reloadedClient.GetAsync("/api/auth/me"), HttpStatusCode.OK, "Session survives a new client with the existing cookie");
await Status(await client.PostAsync("/api/auth/logout", null), HttpStatusCode.NoContent, "Logout succeeds");
await Status(await client.GetAsync("/api/auth/me"), HttpStatusCode.Unauthorized, "Cookie cleared after logout");
await client.PostAsJsonAsync("/api/auth/login", Credentials());
using (var scope = factory.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    db.Users.Remove(await db.Users.SingleAsync());
    await db.SaveChangesAsync();
}
await Status(await client.GetAsync("/api/auth/me"), HttpStatusCode.Unauthorized, "Deleted user session rejected");
Console.WriteLine($"All {checks} authentication integration checks passed.");

}
}
