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
  Row,
  Column,
} from '@react-email/components';

export const LegalAdminInviteEmail = ({
  inviteLink = '{{ .ConfirmationURL }}',
  recipientEmail = 'zxakhek@gmail.com',
  expiryHours = '24',
}) => {
  return (
    <Html>
      <Head />
      <Preview>Invitación Oficial: Administrador Legal - Academia FP Sanidad</Preview>
      <Body style={main}>
        <Container style={container}>
          {/* Header Corporativo Formal */}
          <Section style={headerSection}>
            <Row style={headerRow}>
              <Column style={logoColumn}>
                <Heading style={brandTitle}>
                  Academia <span style={brandHighlight}>FP Sanidad</span>
                </Heading>
                <Text style={brandSubtitle}>Departamento Legal & Cumplimiento Normativo</Text>
              </Column>
              <Column style={badgeColumn}>
                <Text style={legalBadge}>ACCESO OFICIAL</Text>
              </Column>
            </Row>
          </Section>

          <Hr style={dividerHeader} />

          {/* Mensaje Principal */}
          <Section style={contentSection}>
            <Heading style={heading}>Nombramiento como Administrador Legal</Heading>
            
            <Text style={salutation}>Estimado/a Administrador/a Legal,</Text>

            <Text style={paragraph}>
              Has sido invitado como Administrador Legal de la <strong>Academia FP Sanidad</strong>. 
              Haz clic en el siguiente enlace seguro para establecer tu contraseña y acceder al sistema.
            </Text>

            {/* Tarjeta de Responsabilidades y Alcance */}
            <Section style={scopeCard}>
              <Heading style={scopeTitle}>📋 Alcance de las atribuciones administrativas:</Heading>
              
              <Row style={bulletRow}>
                <Column style={bulletIcon}>⚖️</Column>
                <Column style={bulletTextCol}>
                  <Text style={bulletTitle}>Gestión de Avisos Legales y Políticas</Text>
                  <Text style={bulletDesc}>
                    Control de Términos y Condiciones, Avisos Legales, Política de Privacidad (GDPR/LOPDGDD) y Cookies.
                  </Text>
                </Column>
              </Row>

              <Row style={bulletRow}>
                <Column style={bulletIcon}>🔐</Column>
                <Column style={bulletTextCol}>
                  <Text style={bulletTitle}>Políticas de Seguridad RLS</Text>
                  <Text style={bulletDesc}>
                    Acceso exclusivo para actualización e inserción de documentos legales en la base de datos Supabase.
                  </Text>
                </Column>
              </Row>

              <Row style={bulletRow}>
                <Column style={bulletIcon}>🏢</Column>
                <Column style={bulletTextCol}>
                  <Text style={bulletTitle}>Configuración Institucional</Text>
                  <Text style={bulletDesc}>
                    Gestión de datos fiscales, DPO y canales oficiales de atención legal.
                  </Text>
                </Column>
              </Row>
            </Section>

            {/* Botón Call to Action */}
            <Section style={buttonContainer}>
              <Button style={primaryButton} href={inviteLink}>
                Establecer Contraseña y Activar Cuenta
              </Button>
            </Section>

            <Text style={smallLabel}>Enlace directo de activación seguro:</Text>
            <Text style={linkBox}>
              <Link href={inviteLink} style={linkStyle}>
                {inviteLink}
              </Link>
            </Text>

            {/* Caja de Aviso de Seguridad y Caducidad */}
            <Section style={securityCard}>
              <Text style={securityTitle}>🛡️ MEDIDA DE SEGURIDAD Y CADUCIDAD</Text>
              <Text style={securityBody}>
                Este enlace de invitación corporativo ha sido emitido exclusivamente para <strong>{recipientEmail}</strong> y caducará en <strong>{expiryHours} horas</strong>. Si no reconoces esta invitación, ponte en contacto con el equipo de soporte técnico inmediatamente.
              </Text>
            </Section>
          </Section>

          <Hr style={dividerFooter} />

          {/* Pie de Página */}
          <Section style={footerSection}>
            <Text style={footerText}>
              <strong>Academia FP Sanidad S.L.</strong> — Centro de Formación Profesional Sanitaria
            </Text>
            <Text style={footerSubtext}>
              Este mensaje contiene información confidencial dirigida exclusivamente a su destinatario.
            </Text>
            <Text style={footerCopyright}>
              © {new Date().getFullYear()} Academia FP Sanidad. Todos los derechos reservados.
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
};

export default LegalAdminInviteEmail;

// Estilos del Componente
const main = {
  backgroundColor: '#0f172a',
  fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
  margin: '0',
  padding: '40px 0',
};

const container = {
  backgroundColor: '#ffffff',
  margin: '0 auto',
  padding: '40px 36px',
  borderRadius: '12px',
  maxWidth: '620px',
  boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.3), 0 8px 10px -6px rgba(0, 0, 0, 0.3)',
};

const headerSection = {
  paddingBottom: '16px',
};

const headerRow = {
  width: '100%',
};

const logoColumn = {
  textAlign: 'left',
};

const badgeColumn = {
  textAlign: 'right',
  verticalAlign: 'middle',
};

const brandTitle = {
  color: '#0f172a',
  fontSize: '24px',
  fontWeight: '800',
  margin: '0',
  letterSpacing: '-0.5px',
};

const brandHighlight = {
  color: '#1e3a8a', // Azul corporativo legal profundo
};

const brandSubtitle = {
  color: '#475569',
  fontSize: '12px',
  fontWeight: '600',
  margin: '4px 0 0 0',
  textTransform: 'uppercase',
  letterSpacing: '1px',
};

const legalBadge = {
  backgroundColor: '#1e293b',
  color: '#94a3b8',
  fontSize: '10px',
  fontWeight: '700',
  padding: '4px 10px',
  borderRadius: '4px',
  letterSpacing: '1px',
  display: 'inline-block',
  margin: '0',
};

const dividerHeader = {
  borderColor: '#e2e8f0',
  borderWidth: '1px',
  margin: '16px 0 24px 0',
};

const contentSection = {
  padding: '0',
};

const heading = {
  color: '#0f172a',
  fontSize: '22px',
  fontWeight: '700',
  margin: '0 0 16px 0',
  letterSpacing: '-0.3px',
};

const salutation = {
  color: '#1e293b',
  fontSize: '15px',
  fontWeight: '600',
  margin: '0 0 12px 0',
};

const paragraph = {
  color: '#334155',
  fontSize: '15px',
  lineHeight: '1.6',
  margin: '0 0 20px 0',
};

const scopeCard = {
  backgroundColor: '#f8fafc',
  border: '1px solid #e2e8f0',
  borderRadius: '8px',
  padding: '20px',
  margin: '24px 0',
};

const scopeTitle = {
  color: '#0f172a',
  fontSize: '14px',
  fontWeight: '700',
  margin: '0 0 16px 0',
};

const bulletRow = {
  marginBottom: '12px',
};

const bulletIcon = {
  fontSize: '16px',
  width: '28px',
  verticalAlign: 'top',
};

const bulletTextCol = {
  verticalAlign: 'top',
};

const bulletTitle = {
  color: '#1e293b',
  fontSize: '13.5px',
  fontWeight: '600',
  margin: '0 0 2px 0',
};

const bulletDesc = {
  color: '#64748b',
  fontSize: '12.5px',
  lineHeight: '1.4',
  margin: '0',
};

const buttonContainer = {
  textAlign: 'center',
  margin: '32px 0 24px 0',
};

const primaryButton = {
  backgroundColor: '#1e3a8a', // Navy blue corporativo formal
  color: '#ffffff',
  fontSize: '15px',
  fontWeight: '600',
  textDecoration: 'none',
  padding: '14px 32px',
  borderRadius: '8px',
  display: 'inline-block',
  boxShadow: '0 4px 6px -1px rgba(30, 58, 138, 0.3)',
};

const smallLabel = {
  color: '#64748b',
  fontSize: '12px',
  fontWeight: '600',
  margin: '16px 0 4px 0',
};

const linkBox = {
  backgroundColor: '#f1f5f9',
  borderRadius: '6px',
  padding: '10px 14px',
  margin: '0 0 24px 0',
  wordBreak: 'break-all',
};

const linkStyle = {
  color: '#1e3a8a',
  fontSize: '13px',
  textDecoration: 'underline',
};

const securityCard = {
  backgroundColor: '#fefce8',
  borderLeft: '4px solid #eab308',
  borderRadius: '4px',
  padding: '14px 16px',
  margin: '24px 0 0 0',
};

const securityTitle = {
  color: '#854d0e',
  fontSize: '12px',
  fontWeight: '700',
  margin: '0 0 4px 0',
  letterSpacing: '0.5px',
};

const securityBody = {
  color: '#713f12',
  fontSize: '12.5px',
  lineHeight: '1.5',
  margin: '0',
};

const dividerFooter = {
  borderColor: '#cbd5e1',
  margin: '28px 0 20px 0',
};

const footerSection = {
  textAlign: 'center',
};

const footerText = {
  color: '#475569',
  fontSize: '12px',
  margin: '0 0 4px 0',
};

const footerSubtext = {
  color: '#94a3b8',
  fontSize: '11px',
  lineHeight: '1.4',
  margin: '0 0 6px 0',
};

const footerCopyright = {
  color: '#cbd5e1',
  fontSize: '11px',
  margin: '0',
};
