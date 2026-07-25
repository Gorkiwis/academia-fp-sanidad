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

export const VerificationEmail = ({
  userName = 'Estudiante',
  verificationUrl = 'https://academiafpsanidad.es/verify?token=example',
}) => {
  return (
    <Html>
      <Head />
      <Preview>Verifica tu cuenta en Academia FP Sanidad</Preview>
      <Body style={main}>
        <Container style={container}>
          {/* Header / Brand Logo Section */}
          <Section style={headerSection}>
            <Heading style={brandTitle}>
              Academia <span style={brandHighlight}>FP Sanidad</span>
            </Heading>
            <Text style={brandSubtitle}>Formación Profesional Sanitaria</Text>
          </Section>

          <Hr style={divider} />

          {/* Main Content */}
          <Section style={contentSection}>
            <Heading style={heading}>Confirma tu dirección de correo</Heading>
            <Text style={paragraph}>Hola, {userName}:</Text>
            <Text style={paragraph}>
              Gracias por registrarte en Academia FP Sanidad. Para completar tu
              registro y asegurar la protección de tu cuenta, por favor confirma
              tu dirección de correo electrónico haciendo clic en el siguiente
              botón:
            </Text>

            <Section style={buttonContainer}>
              <Button style={primaryButton} href={verificationUrl}>
                Confirmar mi Cuenta
              </Button>
            </Section>

            <Text style={smallText}>
              Si el botón no funciona, también puedes copiar y pegar la siguiente
              URL en tu navegador:
            </Text>
            <Text style={linkText}>
              <Link href={verificationUrl} style={linkStyle}>
                {verificationUrl}
              </Link>
            </Text>

            <Text style={warningText}>
              Este enlace de verificación expirará en 24 horas por motivos de
              seguridad. Si no has solicitado este registro, puedes ignorar este
              mensaje con total tranquilidad.
            </Text>
          </Section>

          <Hr style={divider} />

          {/* Footer */}
          <Section style={footerSection}>
            <Text style={footerText}>
              © {new Date().getFullYear()} Academia FP Sanidad. Todos los derechos reservados.
            </Text>
            <Text style={footerSubtext}>
              Especialistas en Titulaciones Oficiales y Pruebas Libres en Sanidad.
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
};

export default VerificationEmail;

// Component Styles (Inline CSS for restrictive email client compatibility)
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
  backgroundColor: '#2563eb',
  color: '#ffffff',
  fontSize: '15px',
  fontWeight: '600',
  textDecoration: 'none',
  padding: '12px 28px',
  borderRadius: '6px',
  display: 'inline-block',
  boxShadow: '0 2px 4px rgba(37, 99, 235, 0.2)',
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

const warningText = {
  color: '#94a3b8',
  fontSize: '12px',
  lineHeight: '1.5',
  margin: '16px 0 0 0',
  fontStyle: 'italic',
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
