using System;
namespace ContactFormCaptcha.Models
{
        public class Contact
        {
            public string Name { get; set; }
            public string Email { get; set; }
            public string Phone { get; set; }
            public string Message { get; set; }
            public string Token { get; set; }

            internal static bool IsValid(Contact contactInfo)
            {
                bool isValidContact = true;
                if (contactInfo.Name == null)
                {
                    isValidContact = false;
                }
                if (contactInfo.Email == null)
                {
                    isValidContact = false;
                }
                if (contactInfo.Phone == null)
                {
                    isValidContact = false;
                }
                if (contactInfo.Message == null)
                {
                    isValidContact = false;
                }
                if (contactInfo.Token == null)
                {
                    isValidContact = false;
                }

            return isValidContact;
            }
        }
}
