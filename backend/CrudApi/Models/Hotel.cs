namespace CrudApi.Models;

public sealed class Hotel
{
    public int Id { get; set; }

    public string Name { get; set; } = string.Empty;

    public string City { get; set; } = string.Empty;

    public decimal Price { get; set; }

    public decimal Rating { get; set; }

    public string Image { get; set; } = string.Empty;

    public string Description { get; set; } = string.Empty;
}
