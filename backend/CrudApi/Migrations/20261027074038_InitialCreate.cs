using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace CrudApi.Migrations
{
    /// <inheritdoc />
    public partial class InitialCreate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Hotels",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Name = table.Column<string>(type: "nvarchar(120)", maxLength: 120, nullable: false),
                    City = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    Price = table.Column<decimal>(type: "decimal(18,2)", precision: 18, scale: 2, nullable: false),
                    Rating = table.Column<decimal>(type: "decimal(2,1)", precision: 2, scale: 1, nullable: false),
                    Image = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: false),
                    Description = table.Column<string>(type: "nvarchar(1000)", maxLength: 1000, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Hotels", x => x.Id);
                });

            migrationBuilder.InsertData(
                table: "Hotels",
                columns: new[] { "Id", "City", "Description", "Image", "Name", "Price", "Rating" },
                values: new object[,]
                {
                    { 1, "Đà Nẵng", "Khu nghỉ dưỡng cao cấp với hồ bơi, không gian xanh và tầm nhìn hướng biển.", "https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=900&q=80", "The Ocean Resort", 1800000m, 4.9m },
                    { 2, "TP. Hồ Chí Minh", "Khách sạn hiện đại ngay trung tâm thành phố, thuận tiện cho du lịch và công tác.", "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=900&q=80", "Luxury Saigon Hotel", 1450000m, 4.8m },
                    { 3, "Đà Lạt", "Không gian nghỉ dưỡng yên bình giữa thiên nhiên và núi rừng Đà Lạt.", "https://images.unsplash.com/photo-1518780664697-55e3ad937233?auto=format&fit=crop&w=900&q=80", "Mountain View Resort", 1200000m, 4.7m },
                    { 4, "Nha Trang", "Khách sạn gần bãi biển với phòng nghỉ tiện nghi và dịch vụ chuyên nghiệp.", "https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=900&q=80", "Paradise Beach Hotel", 1600000m, 4.8m },
                    { 5, "Hồ Chí Minh", "KTX I05 - không gian lưu trú tiện nghi, phù hợp cho sinh viên và khách cần nơi nghỉ ngắn hạn.", "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=900&q=80", "KTX I05", 300000m, 4.5m }
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Hotels");
        }
    }
}
