using System.ComponentModel.DataAnnotations;

namespace CrudApi.Dtos;

public sealed class AuthRequest
{
    [Required(ErrorMessage = "Vui lòng nhập email.")]
    [EmailAddress(ErrorMessage = "Email không hợp lệ.")]
    [StringLength(254, ErrorMessage = "Email tối đa 254 ký tự.")]
    public string Email { get; set; } = string.Empty;

    [Required(ErrorMessage = "Vui lòng nhập mật khẩu.")]
    [StringLength(128, MinimumLength = 8, ErrorMessage = "Mật khẩu phải có từ 8 đến 128 ký tự.")]
    public string Password { get; set; } = string.Empty;
}

public sealed record UserResponse(int Id, string Email, DateTime CreatedAtUtc);
