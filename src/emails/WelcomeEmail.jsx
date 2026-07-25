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
  Row,
  Column,
} from '@react-email/components';

export const WelcomeEmail = ({
  userName = 'Futuro/a Profesional Sanitario/a',
  courseName = 'FP Sanidad (Titulaciones Oficiales)',
  campusUrl = 'https://academiafpsanidad.es/campus',
}) => {
  return (
    <Html>
      <Head />
      <Preview>¡Bienvenido/a a Academia FP Sanidad! Comienza tu formación</Preview>
      <Body style={main}>
        <Container style={container}>
          {/* Header Banner */}
          <Section style={headerSection}>
            <Heading style={brandTitle}>
              Academia <span style={brandHighlight}>FP Sanidad</span>
            </Heading>
            <Text style={brandSubtitle}>Campus Virtual de Sanidad</Text>
          </Section>

          <Hr style={divider} />

          {/* Main Welcome Message */}
          <Section style={contentSection}>
            <Heading style={heading}>¡Te damos la bienvenida a tu formación!</Heading>
            <Text style={paragraph}>Estimado/a {userName},</Text>
            <Text style={paragraph}>
              Nos alegra enormemente darte la bienvenida a <strong>Academia FP Sanidad</strong>. 
              Tu registro se ha completado con éxito y ya tienes acceso a tu plataforma educativa para el curso de <strong>{courseName}</strong>.
            </Text>

            {/* Next steps / Getting Started */}
            <Section style={cardSection}>
              <Heading style={cardHeading}>Pasos para empezar en el Campus Virtual:</Heading>
              
              <Row style={stepRow}>
                <Column style={stepBadge}>1</Column>
                <Column style={stepTextContainer}>
                  <Text style={stepTitle}>Accede a tu Panel de Alumno</Text>
                  <Text style={stepDescription}>
                    Inicia sesión en el Campus Virtual con las credenciales que creaste durante el registro.
                  </Text>
                </Column>
              </Row>

              <Row style={stepRow}>
                <Column style={stepBadge}>2</Column>
                <Column style={stepTextContainer}>
                  <Text style={stepTitle}>Explora tus Módulos Formativos</Text>
                  <Text style={stepDescription}>
                    Encontrarás las asignaturas, temarios actualizados, clases grabadas y simulacros de examen.
                  </Text>
                </Column>
              </Row>

              <Row style={stepRow}>
                <Column style={stepBadge}>3</Column>
                <Column style={stepTextContainer}>
                  <Text style={stepTitle}>Contacta con tus Tutores</Text>
                  <Text style={stepDescription}>
                    Resuelve tus dudas directamente con nuestro equipo docente especializado en sanidad.
                  </Text>
                </Column>
              </Row>
            </Section>

            {/* CTA Button */}
            <Section style={buttonContainer}>
              <Button style={primaryButton} href={campusUrl}>
                Acceder al Campus Virtual
              </Button>
            </Section>

            <Text style={paragraph}>
              Estamos a tu entera disposición para acompañarte en cada etapa de tu aprendizaje y asegurar tu éxito profesional en el sector sanitario.
            </Text>
          </Section>

          <Hr style={divider} />

          {/* Footer */}
          <Section style={footerSection}>
            <Text style={footerText}>
              ¿Tienes alguna duda? Contáctanos a través de soporte@academiafpsanidad.es
            </Text>
            <Text style={footerSubtext}>
              © {new Date().getFullYear()} Academia FP Sanidad. Todos los derechos reservados.
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
};

export default WelcomeEmail;

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
  fontSize: '22px',
  fontWeight: '700',
  margin: '0 0 16px 0',
};

const paragraph = {
  color: '#334155',
  fontSize: '15px',
  lineHeight: '1.6',
  margin: '0 0 16px 0',
};

const cardSection = {
  backgroundColor: '#f1f5f9',
  padding: '20px',
  borderRadius: '8px',
  margin: '24px 0',
};

const cardHeading = {
  color: '#0f172a',
  fontSize: '16px',
  fontWeight: '700',
  margin: '0 0 16px 0',
};

const stepRow = {
  marginBottom: '16px',
};

const stepBadge = {
  backgroundColor: '#2563eb',
  color: '#ffffff',
  fontWeight: '700',
  fontSize: '14px',
  width: '28px',
  height: '28px',
  borderRadius: '50%',
  textAlign: 'center',
  verticalAlign: 'top',
  paddingTop: '4px',
};

const stepTextContainer = {
  paddingLeft: '12px',
  verticalAlign: 'top',
};

const stepTitle = {
  color: '#1e293b',
  fontSize: '14px',
  fontWeight: '600',
  margin: '0 0 2px 0',
};

const stepDescription = {
  color: '#64748b',
  fontSize: '13px',
  lineHeight: '1.4',
  margin: '0',
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
