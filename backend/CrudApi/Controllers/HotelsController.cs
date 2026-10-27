using CrudApi.Data;
using CrudApi.Dtos;
using CrudApi.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace CrudApi.Controllers;

[ApiController]
[Route("api/[controller]")]
public sealed class HotelsController(AppDbContext dbContext) : ControllerBase
{
    // GET: /api/hotels
    [HttpGet]
    public async Task<ActionResult<IEnumerable<HotelResponse>>> GetAll(CancellationToken cancellationToken)
    {
        var hotels = await dbContext.Hotels
            .AsNoTracking()
            .OrderBy(hotel => hotel.Id)
            .Select(hotel => new HotelResponse(
                hotel.Id, hotel.Name, hotel.City, hotel.Price, hotel.Rating, hotel.Image, hotel.Description))
            .ToListAsync(cancellationToken);

        return Ok(hotels);
    }

    // GET: /api/hotels/1
    [HttpGet("{id:int}")]
    public async Task<ActionResult<HotelResponse>> GetById(int id, CancellationToken cancellationToken)
    {
        var hotel = await dbContext.Hotels.AsNoTracking()
            .FirstOrDefaultAsync(item => item.Id == id, cancellationToken);

        if (hotel is null)
        {
            return NotFound();
        }

        return Ok(ToResponse(hotel));
    }

    // POST: /api/hotels
    [HttpPost]
    public async Task<ActionResult<HotelResponse>> Create(
        [FromBody] HotelWriteRequest request, CancellationToken cancellationToken)
    {
        var hotel = new Hotel
        {
            Name = request.Name.Trim(),
            City = request.City.Trim(),
            Price = request.Price,
            Rating = request.Rating,
            Image = NormalizeImage(request.Image),
            Description = NormalizeDescription(request.Description)
        };

        dbContext.Hotels.Add(hotel);
        await dbContext.SaveChangesAsync(cancellationToken);

        return CreatedAtAction(nameof(GetById), new { id = hotel.Id }, ToResponse(hotel));
    }

    // PUT: /api/hotels/1
    [HttpPut("{id:int}")]
    public async Task<IActionResult> Update(
        int id, [FromBody] HotelWriteRequest request, CancellationToken cancellationToken)
    {
        var hotel = await dbContext.Hotels.FirstOrDefaultAsync(item => item.Id == id, cancellationToken);
        if (hotel is null) return NotFound();

        hotel.Name = request.Name.Trim();
        hotel.City = request.City.Trim();
        hotel.Price = request.Price;
        hotel.Rating = request.Rating;
        hotel.Image = NormalizeImage(request.Image);
        hotel.Description = NormalizeDescription(request.Description);

        await dbContext.SaveChangesAsync(cancellationToken);
        return NoContent();
    }

    // DELETE: /api/hotels/1
    [HttpDelete("{id:int}")]
    public async Task<IActionResult> Delete(int id, CancellationToken cancellationToken)
    {
        var hotel = await dbContext.Hotels.FirstOrDefaultAsync(item => item.Id == id, cancellationToken);
        if (hotel is null) return NotFound();

        dbContext.Hotels.Remove(hotel);
        await dbContext.SaveChangesAsync(cancellationToken);
        return NoContent();
    }

    private static HotelResponse ToResponse(Hotel hotel) => new(
        hotel.Id, hotel.Name, hotel.City, hotel.Price, hotel.Rating, hotel.Image, hotel.Description);

    private static string NormalizeImage(string? image) => string.IsNullOrWhiteSpace(image)
        ? "https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=900&q=80"
        : image.Trim();

    private static string NormalizeDescription(string? description) =>
        string.IsNullOrWhiteSpace(description) ? string.Empty : description.Trim();
}
