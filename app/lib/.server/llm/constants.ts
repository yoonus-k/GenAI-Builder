import type { JSONValue } from 'ai';
import { createScopedLogger } from '~/utils/logger';
import type { OperationType } from './model-router';

const logger = createScopedLogger('LLMConstants');

/*
 * Maximum tokens for response generation (updated for modern model capabilities)
 * This serves as a fallback when model-specific limits are unavailable
 * Modern models like Claude 3.5, GPT-4o, and Gemini Pro support 128k+ tokens
 */
// Maximum tokens for context window (updated for modern model capabilities like Gemini 1.5/2.0 and Kimi)
export const MAX_TOKENS = 1000000;

// Default completion token limit fallback for responses
export const DEFAULT_COMPLETION_LIMIT = 32768;

/*
 * Provider-specific default completion token limits
 * Used as fallbacks when model doesn't specify maxCompletionTokens
 */
export const PROVIDER_COMPLETION_LIMITS: Record<string, number> = {
  OpenAI: 16384, // Higher limit for modern GPT-4o and o1-preview/mini
  Github: 16384,
  Anthropic: 128000, // Opus and Sonnet 3.5 support high output and extended thinking
  Google: 128000, // Gemini 1.5 Pro and 2.0 Flash support very long context and output
  Cohere: 16384,
  DeepSeek: 32768, // DeepSeek V3/R1 has deep reasoning output
  Groq: 128000,
  HuggingFace: 16384,
  Mistral: 32768,
  Ollama: 32768,
  OpenRouter: 128000,
  Perplexity: 32768,
  Together: 128000,
  xAI: 128000,
  LMStudio: 32768,
  OpenAILike: 128000, // Default for most long-in/long-out providers like Moonshot
  AmazonBedrock: 32768,
  Hyperbolic: 32768,
};

/*
 * Reasoning models that require maxCompletionTokens instead of maxTokens
 * These models use internal reasoning tokens and have different API parameter requirements
 */
export function isReasoningModel(modelName: string): boolean {
  const result =
    /^(o1|o3|gpt-5)/i.test(modelName) ||
    /deepseek[-_]?r1/i.test(modelName) ||
    /qwq/i.test(modelName) ||
    /kimi[-_]?thinking/i.test(modelName) ||
    /kimi[-_]?k/i.test(modelName);

  logger.debug(`REGEX TEST: "${modelName}" matches reasoning pattern: ${result}`);

  return result;
}

/**
 * Determines if a model supports extended thinking via providerOptions.
 * Returns the appropriate providerOptions object for the given provider/model,
 * or undefined if the model/provider doesn't support extended thinking.
 */
export function getThinkingProviderOptions(
  providerName: string,
  modelName: string,
  maxOutputTokens: number,
): Record<string, Record<string, JSONValue>> | undefined {
  const budgetTokens = Math.max(1024, Math.min(Math.floor(maxOutputTokens * 0.25), 32000));

  if (providerName === 'Anthropic') {
    // Claude 3.5 Sonnet, Claude 4 Opus, Claude 4 Sonnet support extended thinking
    if (/claude/i.test(modelName)) {
      logger.info(`Enabling Anthropic extended thinking for ${modelName} (budget: ${budgetTokens} tokens)`);

      return {
        anthropic: {
          thinking: { type: 'enabled', budgetTokens },
        },
      };
    }
  }

  if (providerName === 'Google') {
    // Gemini 2.5 Pro/Flash and thinking models support thinkingConfig
    if (/gemini-2\.5|gemini-2\.0-flash-thinking/i.test(modelName)) {
      logger.info(`Enabling Google thinking for ${modelName} (budget: ${budgetTokens} tokens)`);

      return {
        google: {
          thinkingConfig: { thinkingBudget: budgetTokens, includeThoughts: true },
        },
      };
    }
  }

  // DeepSeek R1, QWQ, Kimi thinking — thinking is built into the model, no providerOptions needed
  return undefined;
}

/**
 * Calculate the completion token limit for a given model.
 *
 * Priority:
 * 1. Model-specific `maxCompletionTokens`
 * 2. Provider-specific default from `PROVIDER_COMPLETION_LIMITS`
 * 3. Fallback: `min(MAX_TOKENS, 16384)`
 */
export function getCompletionTokenLimit(modelDetails: {
  maxCompletionTokens?: number;
  maxTokenAllowed?: number;
  provider: string;
}): number {
  const providerDefault =
    PROVIDER_COMPLETION_LIMITS[modelDetails.provider] || Math.min(MAX_TOKENS, DEFAULT_COMPLETION_LIMIT);
  if (modelDetails.maxTokenAllowed && providerDefault > modelDetails.maxTokenAllowed) {
    return modelDetails.maxTokenAllowed;
  }

  return providerDefault;
}

/**
 * Per-operation token budgets.
 * Maps each OperationType to recommended input/output token limits,
 * guiding how many tokens to allocate for each kind of LLM interaction.
 */
export const OPERATION_TOKEN_BUDGETS: Record<OperationType, { inputTokens: number; outputTokens: number }> = {
  code_generation: { inputTokens: 32000, outputTokens: 64000 },
  planning: { inputTokens: 16000, outputTokens: 8000 },
  error_correction: { inputTokens: 32000, outputTokens: 32000 },
  summarization: { inputTokens: 64000, outputTokens: 4000 },
  general: { inputTokens: 16000, outputTokens: 8000 },
  blueprint: { inputTokens: 16000, outputTokens: 16000 },
};

// limits the number of model responses that can be returned in a single request
export const MAX_RESPONSE_SEGMENTS = 2;

export interface File {
  type: 'file';
  content: string;
  isBinary: boolean;
  isLocked?: boolean;
  lockedByFolder?: string;
}

export interface Folder {
  type: 'folder';
  isLocked?: boolean;
  lockedByFolder?: string;
}

type Dirent = File | Folder;

export type FileMap = Record<string, Dirent | undefined>;

export const IGNORE_PATTERNS = [
  'node_modules/**',
  '.git/**',
  'dist/**',
  'build/**',
  '.next/**',
  'coverage/**',
  '.cache/**',
  '.vscode/**',
  '.idea/**',
  '**/*.log',
  '**/.DS_Store',
  '**/npm-debug.log*',
  '**/yarn-debug.log*',
  '**/yarn-error.log*',
  '**/*lock.json',
  '**/*lock.yml',
  '**/*lock.yaml',
  '**/pnpm-lock.yaml',
  '**/_devonz-*',
];

/*
 * ---------------------------------------------------------------------------
 * Context Window Management Constants (Agent Mode v3)
 * ---------------------------------------------------------------------------
 */

/**
 * Known context window sizes (in tokens) for popular model families.
 * Used by the context window manager when the provider does not report limits.
 */
export const MODEL_CONTEXT_LIMITS: Record<string, number> = {
  // Anthropic
  'claude-4-opus': 200_000,
  'claude-4-sonnet': 200_000,
  'claude-3.5-sonnet': 200_000,
  'claude-3-haiku': 200_000,

  // OpenAI
  'gpt-4o': 128_000,
  'gpt-4o-mini': 128_000,
  'gpt-4-turbo': 128_000,
  'gpt-4': 8_192,
  o1: 200_000,
  'o1-mini': 128_000,
  o3: 200_000,
  'o3-mini': 200_000,

  // Google
  'gemini-2.5-pro': 1_000_000,
  'gemini-2.5-flash': 1_000_000,
  'gemini-2.0-flash': 1_000_000,
  'gemini-1.5-pro': 2_000_000,
  'gemini-1.5-flash': 1_000_000,

  // DeepSeek
  'deepseek-v3': 128_000,
  'deepseek-r1': 128_000,

  // Mistral
  'mistral-large': 128_000,
  'mistral-medium': 32_000,
  'mistral-small': 32_000,

  // xAI
  'grok-2': 131_072,
  'grok-3': 131_072,

  // Moonshot (Kimi)
  'kimi-k2.5': 256_000,
};

/**
 * Default threshold at which the context-window manager triggers summarization.
 * Expressed as a fraction (0-1) of the model's max context window.
 * @default 0.75
 */
export const CONTEXT_THRESHOLD_PCT = 0.75;
