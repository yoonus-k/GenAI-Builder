import { type ActionFunctionArgs } from 'react-router';
import { externalFetch } from '~/lib/api/apiUtils';
import { withSecurity } from '~/lib/security';
import { successResponse, errorResponse } from '~/lib/api/responses';
import { AppError, AppErrorType } from '~/lib/api/errors';
import { AUTH_PRESETS } from '~/lib/security-config';
import { createScopedLogger } from '~/utils/logger';
import { z } from 'zod';

const logger = createScopedLogger('SupabaseVars');

const supabaseVariablesRequestSchema = z.object({
  projectId: z.string(),
  token: z.string().optional().default(''),
});

async function supabaseVariablesAction({ request }: ActionFunctionArgs) {
  let rawBody: unknown;

  try {
    rawBody = await request.json();
  } catch {
    return errorResponse(new AppError(AppErrorType.VALIDATION, 'Invalid JSON in request body', 400));
  }

  const parsed = supabaseVariablesRequestSchema.safeParse(rawBody);

  if (!parsed.success) {
    logger.warn('Validation failed:', parsed.error.flatten());

    return errorResponse(
      new AppError(AppErrorType.VALIDATION, 'Invalid request body', 400, {
        details: parsed.error.flatten().fieldErrors,
      }),
    );
  }

  const { projectId, token } = parsed.data;

  /*
   * ── Local Supabase: return env-var credentials directly ───────────────────
   * The synthetic local project uses id='local'. For local instances the
   * anon/service keys come from VITE_SUPABASE_ANON_KEY / VITE_SUPABASE_SERVICE_ROLE_KEY.
   */
  if (projectId === 'local') {
    const anonKey = process.env.VITE_SUPABASE_ANON_KEY;
    const serviceRoleKey = process.env.VITE_SUPABASE_SERVICE_ROLE_KEY;

    if (!anonKey && !serviceRoleKey) {
      return errorResponse(
        new AppError(
          AppErrorType.VALIDATION,
          'No local Supabase keys found. Set VITE_SUPABASE_ANON_KEY and/or VITE_SUPABASE_SERVICE_ROLE_KEY in your .env.local',
          400,
        ),
      );
    }

    const apiKeys = [];

    if (anonKey) {
      apiKeys.push({ name: 'anon', api_key: anonKey });
    }

    if (serviceRoleKey) {
      apiKeys.push({ name: 'service_role', api_key: serviceRoleKey });
    }

    logger.info('Local Supabase variables returned from env vars');

    return successResponse({ apiKeys });
  }

  // ── Cloud Supabase: fetch from Management API ─────────────────────────────
  if (!token) {
    return errorResponse(
      new AppError(AppErrorType.UNAUTHORIZED, 'Supabase access token is required for cloud projects', 401),
    );
  }

  try {
    const response = await externalFetch({
      url: `https://api.supabase.com/v1/projects/${projectId}/api-keys`,
      token,
      headers: { 'Content-Type': 'application/json' },
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new AppError(AppErrorType.NETWORK, `Failed to fetch API keys: ${errorText}`, response.status);
    }

    const apiKeys = await response.json();

    return successResponse({ apiKeys });
  } catch (error) {
    if (error instanceof AppError) {
      return errorResponse(error);
    }

    logger.error('Supabase variables fetch failed', error);

    return errorResponse(error instanceof Error ? error : String(error));
  }
}

export const action = withSecurity(supabaseVariablesAction, { auth: AUTH_PRESETS.authenticated });
