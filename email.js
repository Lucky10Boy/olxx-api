const mailgun = require('mailgun-js');
const mg = mailgun({
  apiKey: process.env.MAILGUN_API_KEY,
  domain: process.env.MAILGUN_DOMAIN,
});

module.exports = class Email {
  constructor(email, url) {
    this.to = email;
    this.url = url;
    this.from = `Bozortoy <lucky10boypro@olxx.com>`;
  }

  // Send the actual email
  async send(subject, html) {
    const mailOptions = {
      from: this.from,
      to: this.to,
      subject,
      html,
    };

    await mg.messages().send(mailOptions, function (error, body) {
      if (error) {
        console.log(error);
        return;
      }
    });
  }
  async sendPasswordReset() {
    await this.send(
      'Ваш запрос на сброс пароля действителен только на 10 мин ',
      `<h1>Bozortoy сброс пароля</h1> <br/>
      <p>Чтобы сбросить пароль идите по этой ссылке ${this.url}</p>
      <br/>
      <p>Если вы не сделали запрос чтобы сбросить пароль то игнорируйте эту почту </p>
    `
    );
  }
  async sendEmailVerification(emailVerificationCode) {
    await this.send(
      'Регистрация на Bozortoy',
      `
      <h1>Регистрация Bozortoy</h1> <br/>
      <p>Ваш код ${emailVerificationCode} для регистрации на Bozortoy</p>
      <br/>
      <p>Если вы не сделали запрос на Bozortoy на регистрацию то игнорируйте эту почту </p>
    `
    );
  }
};
