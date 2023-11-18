import sgMail from "@sendgrid/mail";
sgMail.setApiKey(`${process.env.SENDGRID_API_KEY}`);

export function sendVerificationEmail({
  userEmail,
  userName,
  verificationLink,
}: {
  userEmail: string;
  userName: string;
  verificationLink: string;
}) {
  return new Promise<void>((resolve, reject) => {
    const msg = {
        from: {
          email: "sangwanshivam762001@gmail.com",
          name: "SpicyLickz",
        },
      personalizations: [ 
        {
          to: [
            {
              email: userEmail,
            },
          ],
          dynamic_template_data: {
            name: userName,
            verificationLink: verificationLink,
          },
        },
      ],
      template_id: "d-7d3e722b355f417c8449b4fd73adafa6",
    };

    (sgMail as any)
      .send(msg)
      .then(() => {
        resolve();
      })
      .catch((error: any) => {
        console.error(error.toString());
        reject(error);
      });
  });
}
