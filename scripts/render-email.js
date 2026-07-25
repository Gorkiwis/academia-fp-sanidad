import React from 'react';
import { render } from '@react-email/render';
import LegalAdminInviteEmail from '../src/emails/LegalAdminInviteEmail.jsx';

async function generateHtml() {
  const html = await render(
    React.createElement(LegalAdminInviteEmail, {
      inviteLink: '{{ .ConfirmationURL }}',
      recipientEmail: '{{ .Email }}',
      expiryHours: '24'
    }),
    { pretty: true }
  );

  console.log(html);
}

generateHtml();
