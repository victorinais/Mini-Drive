using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using MailKit.Net.Smtp;
using Microsoft.AspNetCore.Mvc;
using MimeKit;
using Mini_Drive.Models;
using Mini_Drive.Services.Users;

namespace Mini_Drive.Controllers.Users
{
    public class UserCreateController : ControllerBase
    {
        private readonly IUserRepository _userRepository;
        public UserCreateController(IUserRepository userRepository)
        {
            _userRepository = userRepository;
        }

        [HttpPost]
        [Route("api/register")]
        public IActionResult Register([FromBody] User user)
        {
            if (user == null)
            {
                return BadRequest("User data is null.");
            }

            try
            {
                if (_userRepository.GetAll().Any(u => u.Email == user.Email))
                {
                    return BadRequest("Correo electrónico ya en uso.");
                }

                // Hash la contraseña antes de almacenar
                user.Password = HashPassword(user.Password!);

                // Enviar correo electrónico de verificación
                SendConfirmationEmail(user.Email!);

                // Guardar el usuario en la base de datos solo si el correo fue enviado correctamente
                _userRepository.Add(user);

                return Ok("Registro con éxito.");
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        private string HashPassword(string password)
        {
            return BCrypt.Net.BCrypt.HashPassword(password);
        }

        private void SendConfirmationEmail(string email)
        {
            var message = new MimeMessage();
            message.From.Add(new MailboxAddress("Mini-Drive", "pruebariwi@gmail.com"));
            message.To.Add(new MailboxAddress("", email));
            message.Subject = "Confirmación de registro";
            message.Body = new TextPart("plain")
            {
                Text = "Tu registro fue exitoso. ¡Bienvenido a Mini Drive!"
            };

            using (var client = new SmtpClient())
            {
                 try
                {
                    client.Connect("smtp.gmail.com", 587, false);
                    client.Authenticate("pruebariwi@gmail.com", "cijm vdzz fmza opwu"); // Usa la contraseña de la aplicación aquí
                    client.Send(message);
                }
                catch (SmtpCommandException ex)
                {
                    Console.WriteLine($"Error SMTP: {ex.StatusCode}");
                    throw;
                }
                catch (SmtpProtocolException ex)
                {
                    Console.WriteLine($"Error de protocolo SMTP: {ex.Message}");
                    throw;
                }
                catch (Exception ex)
                {
                    Console.WriteLine($"Error al enviar el correo electrónico: {ex.Message}");
                    throw;
                }
                finally
                {
                    client.Disconnect(true);
                }
            }
        }
    }
}