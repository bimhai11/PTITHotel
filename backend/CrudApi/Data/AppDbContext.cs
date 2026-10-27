using CrudApi.Models;
using Microsoft.EntityFrameworkCore;

namespace CrudApi.Data;

public sealed class AppDbContext(DbContextOptions<AppDbContext> options) : DbContext(options)
{
    public DbSet<Hotel> Hotels => Set<Hotel>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        var hotel = modelBuilder.Entity<Hotel>();
        hotel.HasKey(item => item.Id);
        hotel.Property(item => item.Name).HasMaxLength(120).IsRequired();
        hotel.Property(item => item.City).HasMaxLength(100).IsRequired();
        hotel.Property(item => item.Price).HasPrecision(18, 2);
        hotel.Property(item => item.Rating).HasPrecision(2, 1);
        hotel.Property(item => item.Image).HasMaxLength(500).IsRequired();
        hotel.Property(item => item.Description).HasMaxLength(1000).IsRequired();

        // Dữ liệu minh họa sẽ được thêm bởi migration InitialCreate.
        hotel.HasData(
            new Hotel { Id = 1, Name = "The Ocean Resort", City = "Đà Nẵng", Price = 1800000m, Rating = 4.9m, Image = "https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=900&q=80", Description = "Khu nghỉ dưỡng cao cấp với hồ bơi, không gian xanh và tầm nhìn hướng biển." },
            new Hotel { Id = 2, Name = "Luxury Saigon Hotel", City = "TP. Hồ Chí Minh", Price = 1450000m, Rating = 4.8m, Image = "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=900&q=80", Description = "Khách sạn hiện đại ngay trung tâm thành phố, thuận tiện cho du lịch và công tác." },
            new Hotel { Id = 3, Name = "Mountain View Resort", City = "Đà Lạt", Price = 1200000m, Rating = 4.7m, Image = "https://images.unsplash.com/photo-1518780664697-55e3ad937233?auto=format&fit=crop&w=900&q=80", Description = "Không gian nghỉ dưỡng yên bình giữa thiên nhiên và núi rừng Đà Lạt." },
            new Hotel { Id = 4, Name = "Paradise Beach Hotel", City = "Nha Trang", Price = 1600000m, Rating = 4.8m, Image = "https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=900&q=80", Description = "Khách sạn gần bãi biển với phòng nghỉ tiện nghi và dịch vụ chuyên nghiệp." },
            new Hotel { Id = 5, Name = "KTX I05", City = "Hồ Chí Minh", Price = 300000m, Rating = 4.5m, Image = "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=900&q=80", Description = "KTX I05 - không gian lưu trú tiện nghi, phù hợp cho sinh viên và khách cần nơi nghỉ ngắn hạn." }
        );
    }
}
