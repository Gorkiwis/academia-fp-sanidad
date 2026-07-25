import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Cargar variables de entorno desde .env.local o .env
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../.env.local') });
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const SUPABASE_URL = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_SERVICE_ROLE_KEY;

const TARGET_EMAIL = process.argv[2] || 'zxakhek@gmail.com';

async function inviteLegalAdmin() {
  console.log('---------------------------------------------------------');
  console.log('🚀 Iniciando proceso de invitación para Administrador Legal');
  console.log('---------------------------------------------------------');
  
  if (!SUPABASE_URL) {
    console.error('❌ Error: Falta la variable de entorno SUPABASE_URL o VITE_SUPABASE_URL.');
    process.exit(1);
  }

  if (!SUPABASE_SERVICE_ROLE_KEY) {
    console.error('❌ Error Crítico: Falta la clave SUPABASE_SERVICE_ROLE_KEY (Service Role).');
    console.error('⚠️ NUNCA utilices VITE_SUPABASE_ANON_KEY para operaciones de administración auth.admin.');
    process.exit(1);
  }

  // Inicializar cliente Supabase con privilegios administrativos del Service Role
  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });

  try {
    console.log(`📧 Enviando correo de invitación a: ${TARGET_EMAIL}...`);
    
    // 1. Invitar al usuario mediante la API de administración de Supabase
    const { data: inviteData, error: inviteError } = await supabase.auth.admin.inviteUserByEmail(
      TARGET_EMAIL,
      {
        redirectTo: `${process.env.SITE_URL || 'https://academiafpsanidad.es'}/reset-password`,
        data: {
          role: 'legal_admin',
          invited_by: 'system_admin',
          invited_at: new Date().toISOString(),
        },
      }
    );

    if (inviteError) {
      console.error('❌ Error al invitar al usuario mediante Supabase Auth:', inviteError.message);
      throw inviteError;
    }

    const userId = inviteData.user.id;
    console.log(`✅ Invitación enviada con éxito. User ID generado: ${userId}`);

    // 2. Actualizar / Forzar el rol a 'legal_admin' en la tabla 'profiles'
    console.log(`🔒 Asignando rol 'legal_admin' en la tabla profiles para User ID: ${userId}...`);
    
    const { data: profileData, error: profileError } = await supabase
      .from('profiles')
      .upsert(
        {
          id: userId,
          role: 'legal_admin',
          nombre: 'Administrador',
          apellidos: 'Legal',
          grado: 'Departamento Legal & Cumplimiento',
          municipio: 'Madrid',
          centro_estudios: 'Sede Central Academia FP Sanidad',
          updated_at: new Date().toISOString(),
        },
        { onConflict: 'id' }
      )
      .select();

    if (profileError) {
      console.error('❌ Error al actualizar el perfil en la tabla profiles:', profileError.message);
      throw profileError;
    }

    console.log('---------------------------------------------------------');
    console.log('🎉 PROCESO COMPLETADO CON ÉXITO');
    console.log(`👤 Usuario: ${TARGET_EMAIL}`);
    console.log(`🔑 Rol asignado: legal_admin`);
    console.log(`🆔 Profiles Record ID: ${userId}`);
    console.log('---------------------------------------------------------');
  } catch (error) {
    console.error('💥 Error durante la ejecución del script:', error);
    process.exit(1);
  }
}

inviteLegalAdmin();
