using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using ContactFormCaptcha.Models;
using System.Net.Http;
using System.Net.Mail;
using System.Net;
using Newtonsoft.Json.Linq;

namespace ContactFormCaptcha.Api
{
    [Route("api/[controller]")]
    public class ContactController : Controller
    {
        public bool isValidCaptcha(string response)
        {
            using (var client = new WebClient())
            {
                var secret = "Your Secret Captcha Token";
                var googleResponse = client.DownloadString($"https://www.google.com/recaptcha/api/siteverify?secret={ secret }&response={ response }");
                return (bool)JObject.Parse(googleResponse)["success"];
            }
        }

        // POST api/values
        [HttpPost]
        public HttpResponseMessage Post([FromBody] Contact contactInfo)
        {
            if (Contact.IsValid(contactInfo))
            {
                if (isValidCaptcha(contactInfo.Token))
                {
                    try
                    {
                        using (MailMessage emailMessage = new MailMessage())
                        {
                            emailMessage.From = new MailAddress("From Email");
                            emailMessage.To.Add(new MailAddress("To Email"));
                            emailMessage.Subject = "Website Contact Request";
                            emailMessage.Body = "A contact request has been made! /n"
                                + "/nName: " + contactInfo.Name
                                + "/nEmail: " + contactInfo.Email
                                + "/nPhone: " + contactInfo.Phone
                                + "/nMessage: " + contactInfo.Message;
                            emailMessage.Priority = MailPriority.Normal;
                            using (SmtpClient MailClient = new SmtpClient("your email SMTP server", 587))
                            {
                                MailClient.EnableSsl = true;
                                MailClient.Credentials = new System.Net.NetworkCredential("Email", "Password","domain");
                                MailClient.Send(emailMessage);
                            }
                        }
                        return new HttpResponseMessage(HttpStatusCode.OK);

                    }
                    catch (Exception)
                    {
                        throw new HttpRequestException();
                    }
                }
                else
                {
                    throw new HttpRequestException();
                }
            }
            else
            {
                throw new HttpRequestException();
            }
        }
    }
}
