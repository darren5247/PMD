const utils = require('@strapi/utils');

/**
 * A set of functions called "actions" for `confirm-opt`
 */
const { ApplicationError } = utils.errors;

module.exports = {
  async confirm(ctx: { request: { body: { email: any; code: any; }; }; badRequest: (arg0: string) => any; send: (arg0: { ok: boolean; message: string; }) => void; }) {
    const { email, code } = ctx.request.body;
    if (!email || !code) {
      throw new ApplicationError('Invalid or expired code');
    }

    const now = new Date();

    const entries = await strapi.entityService.findMany('plugin::users-permissions.user', {
      filters: { email, otpCode: code, otpExpiresAt: { $gt: now }, confirmed: false },
    });

    if (!entries.length) {
      throw new ApplicationError('Invalid or expired code');

    }

    const user = await strapi.db.query('plugin::users-permissions.user').findOne({
      where: { email },
    });

    if (!user) {
      throw new ApplicationError('Account not found');

    }

    await strapi.db.query('plugin::users-permissions.user').update({
      where: { id: user.id },
      data: { confirmed: true },
    });

    ctx.send({ ok: true, message: 'Account confirmed successfully' });
  },

  async resend(ctx: { request: { body: { email: any; }; }; badRequest: (arg0: string) => any; send: (arg0: { ok: boolean; message: string; }) => void; }) {
    const { email } = ctx.request.body;

    const user = await strapi.query('plugin::users-permissions.user').findOne({
      where: { email },
    });

    if (!user) {
      throw new ApplicationError('Account not found');
    }

    if (user.confirmed) {
      throw new ApplicationError('Account already confirmed');
    }

    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 mins

    await strapi.entityService.update('plugin::users-permissions.user', user.id, {
      data: {
        otpCode,
        otpExpiresAt,
        confirmed: false
      },
    });

    await strapi.plugin('email').service('email').send({
      to: email,
      subject: 'Account confirmation',
      text: `
            <p>Your confirmation code is: ${otpCode}</p>
            <p>Thank you for creating an account on Piano Music Database. In order to use your new account, we need you to verify that you can access this account's email address.</p>
            <p>Click the link below to enter the code</p>
            <p>http://localhost:3000/confirm-code?email=${encodeURIComponent(email)}</p>
          `,
      html: `
            <p>Your confirmation code is: ${otpCode}</p>
            <p>Thank you for creating an account on Piano Music Database. In order to use your new account, we need you to verify that you can access this account's email address.</p>
            <p>Click the link below to enter the code</p>
            <p>http://localhost:3000/confirm-code?email=${encodeURIComponent(email)}</p>
          `,
    });

    ctx.send({ ok: true, message: 'Confirmation code resent.' });
  }
};
