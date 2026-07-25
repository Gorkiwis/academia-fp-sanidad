// Supabase Edge Function: invite-legal-admin
// Follows Deno environment & Supabase Edge Function specifications

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? "";
    const supabaseServiceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";

    if (!supabaseUrl || !supabaseServiceRoleKey) {
      return new Response(
        JSON.stringify({ error: "Falta SUPABASE_URL o SUPABASE_SERVICE_ROLE_KEY en las variables de entorno." }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Parse request body if provided, fallback to default email
    let email = "zxakhek@gmail.com";
    try {
      const body = await req.json();
      if (body.email) email = body.email;
    } catch {
      // Usar email por defecto si el body viene vacío
    }

    // Inicializar Supabase Client con Service Role Key
    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceRoleKey, {
      auth: { autoRefreshToken: false, persistSession: false },
    });

    // 1. Invitar usuario por correo
    const { data: inviteData, error: inviteError } = await supabaseAdmin.auth.admin.inviteUserByEmail(
      email,
      {
        redirectTo: `${Deno.env.get("SITE_URL") || "https://academiafpsanidad.es"}/reset-password`,
        data: { role: "legal_admin" },
      }
    );

    if (inviteError) {
      return new Response(
        JSON.stringify({ error: `Error al invitar al usuario: ${inviteError.message}` }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const userId = inviteData.user.id;

    // 2. Actualizar perfil con el rol legal_admin
    const { error: profileError } = await supabaseAdmin.from("profiles").upsert(
      {
        id: userId,
        role: "legal_admin",
        nombre: "Administrador",
        apellidos: "Legal",
        grado: "Dirección Legal",
        municipio: "Madrid",
        centro_estudios: "Academia FP Sanidad",
        updated_at: new Date().toISOString(),
      },
      { onConflict: "id" }
    );

    if (profileError) {
      return new Response(
        JSON.stringify({ error: `Error al actualizar perfil: ${profileError.message}` }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify({
        message: "Invitación enviada y rol legal_admin asignado con éxito.",
        userId,
        email,
        role: "legal_admin",
      }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err) {
    return new Response(
      JSON.stringify({ error: (err as Error).message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
