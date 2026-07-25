import React from 'react';
import {
  Html,
  Head,
  Preview,
  Body,
  Container,
  Section,
  Text,
  Button,
  Heading,
  Hr,
  Link,
} from '@react-email/components';

export const ResetPasswordEmail = ({
  userName = 'Usuario',
  resetUrl = 'https://academiafpsanidad.es/reset-password?token=example',
}) => {
  return (
    <Html>
      <Head />
      <Preview>Restablecimiento de contraseña en Academia FP Sanidad</Preview>
      <Body style={main}>
        <Container style={container}>
          {/* Header */}
          <Section style={headerSection}>
            <Heading style={brandTitle}>
              Academia <span style={brandHighlight}>FP Sanidad</span>
            </Heading>
            <Text style={brandSubtitle}>Seguridad de la Cuenta</Text>
          </Section>

          <Hr style={divider} />

          {/* Main Content */}
          <Section style={contentSection}>
            <Heading style={heading}>Restablecer tu Contraseña</Heading>
            <Text style={paragraph}>Hola, {userName}:</Text>
            <Text style={paragraph}>
              Hemos recibido una solicitud para restablecer la contraseña asociada a tu cuenta en Academia FP Sanidad.
            </Text>
            <Text style={paragraph}>
              Para definir una nueva contraseña, haz clic en el siguiente botón:
            </Text>

            <Section style={buttonContainer}>
              <Button style={primaryButton} href={resetUrl}>
                Restablecer Contraseña
              </Button>
            </Section>

            <Text style={smallText}>
              Si el botón no funciona, puedes utilizar la siguiente URL directa:
            </Text>
            <Text style={linkText}>
              <Link href={resetUrl} style={linkStyle}>
                {resetUrl}
              </Link>
            </Text>

            {/* Security Warning Box */}
            <Section style={warningCard}>
              <Text style={warningTitle}>⚠️ AVISO DE SEGURIDAD</Text>
              <Text style={warningBody}>
                Este enlace caducará en <strong>30 minutos</strong> por seguridad. Si tú no has solicitado restablecer tu contraseña, 
                ignora este correo electrónico o contacta de inmediato con nuestro soporte técnico. Tu contraseña actual seguirá siendo segura.
              </Text>
            </Section>
          </Section>

          <Hr style={divider} />

          {/* Footer */}
          <Section style={footerSection}>
            <Text style={footerText}>
              © {new Date().getFullYear()} Academia FP Sanidad. Todos los derechos reservados.
            </Text>
            <Text style={footerSubtext}>
              Mensaje automático enviado por motivos de seguridad de tu cuenta.
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
};

export default ResetPasswordEmail;

// Component Styles
const main = {
  backgroundColor: '#f8fafc',
  fontFamily:
    '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
  margin: '0',
  padding: '40px 0',
};

const container = {
  backgroundColor: '#ffffff',
  margin: '0 auto',
  padding: '40px 32px',
  borderRadius: '8px',
  border: '1px solid #e2e8f0',
  maxWidth: '600px',
  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)',
};

const headerSection = {
  textAlign: 'center',
  paddingBottom: '20px',
};

const brandTitle = {
  color: '#0f172a',
  fontSize: '26px',
  fontWeight: '800',
  margin: '0',
  letterSpacing: '-0.5px',
};

const brandHighlight = {
  color: '#2563eb',
};

const brandSubtitle = {
  color: '#64748b',
  fontSize: '13px',
  fontWeight: '500',
  margin: '4px 0 0 0',
  textTransform: 'uppercase',
  letterSpacing: '1px',
};

const divider = {
  borderColor: '#e2e8f0',
  margin: '20px 0',
};

const contentSection = {
  padding: '10px 0',
};

const heading = {
  color: '#1e293b',
  fontSize: '20px',
  fontWeight: '700',
  margin: '0 0 16px 0',
};

const paragraph = {
  color: '#334155',
  fontSize: '15px',
  lineHeight: '1.6',
  margin: '0 0 16px 0',
};

const buttonContainer = {
  textAlign: 'center',
  margin: '28px 0',
};

const primaryButton = {
  backgroundColor: '#dc2626',
  color: '#ffffff',
  fontSize: '15px',
  fontWeight: '600',
  textDecoration: 'none',
  padding: '12px 28px',
  borderRadius: '6px',
  display: 'inline-block',
  boxShadow: '0 2px 4px rgba(220, 38, 38, 0.2)',
};

const smallText = {
  color: '#64748b',
  fontSize: '13px',
  lineHeight: '1.5',
  margin: '20px 0 6px 0',
};

const linkText = {
  margin: '0 0 20px 0',
  wordBreak: 'break-all',
};

const linkStyle = {
  color: '#2563eb',
  fontSize: '13px',
  textDecoration: 'underline',
};

const warningCard = {
  backgroundColor: '#fef2f2',
  borderLeft: '4px solid #ef4444',
  padding: '16px',
  borderRadius: '4px',
  margin: '24px 0 0 0',
};

const warningTitle = {
  color: '#991b1b',
  fontSize: '13px',
  fontWeight: '700',
  margin: '0 0 4px 0',
  letterSpacing: '0.5px',
};

const warningBody = {
  color: '#7f1d1d',
  fontSize: '13px',
  lineHeight: '1.5',
  margin: '0',
};

const footerSection = {
  textAlign: 'center',
  paddingTop: '10px',
};

const footerText = {
  color: '#64748b',
  fontSize: '12px',
  margin: '0 0 4px 0',
};

const footerSubtext = {
  color: '#94a3b8',
  fontSize: '11px',
  margin: '0',
};
