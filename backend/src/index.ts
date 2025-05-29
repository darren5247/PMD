export default {
  /**
   * An asynchronous register function that runs before
   * your application is initialized.
   *
   * This gives you an opportunity to extend code.
   */
  register(/*{ strapi }*/) {},

  /**
   * An asynchronous bootstrap function that runs before
   * your application gets started.
   *
   * This gives you an opportunity to set up your data model,
   * run jobs, or perform some special logic.
   */
  bootstrap({ strapi }: { strapi: any }) {
    strapi.db.lifecycles.subscribe({
      models: ["plugin::users-permissions.user"], 

      async afterCreate(event: any) {
        const { result, params } = event;
        const email = result.email
        const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
        const otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 mins

        await strapi.entityService.update('plugin::users-permissions.user', result.id, {
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
      },

      async afterUpdate(event: any) {
        const { result, params } = event;

        if (result.confirmed == true && params.data.confirmed == true) {
          try {
            const email = result.email;

            await strapi.plugin('email').service('email').send({
              to: email,
              subject: 'Welcome to PMD!',
              text: 'Thanks for confirming your email. Welcome to PianoMusicDatabase!',
              html: `<p>Thanks for confirming your email. Welcome to <strong>PianoMusicDatabase</strong>!</p>`,
            });

            await strapi.plugin('email').service('email').send({
              to: "new-user@pianomusicdatabase.com",
              subject: 'New User!',
              text: `New user ${email} is registered`,
              html: `<p>New user ${email} is registered</p>`,
            });
          } catch (err) {
            strapi.log.error("error sending welcome email", err)
          }
        }
      },
    });
  },
};
