using System.ComponentModel.DataAnnotations;

namespace CrudApi.Dtos;

public sealed class HotelWriteRequest
{
    [Required]
    [StringLength(120, MinimumLength = 2)]
    public string Name { get; init; } = string.Empty;

    [Required]
    [StringLength(100, MinimumLength = 2)]
    public string City { get; init; } = string.Empty;

    [Range(typeof(decimal), "0.01", "999999999999")]
    public decimal Price { get; init; }

    [Range(typeof(decimal), "0", "5")]
    public decimal Rating { get; init; } = 4.5m;

    [StringLength(500)]
    public string? Image { get; init; }

    [StringLength(1000)]
    public string? Description { get; init; }
}
