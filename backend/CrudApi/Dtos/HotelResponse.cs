namespace CrudApi.Dtos;

public sealed record HotelResponse(
    int Id,
    string Name,
    string City,
    decimal Price,
    decimal Rating,
    string Image,
    string Description);
