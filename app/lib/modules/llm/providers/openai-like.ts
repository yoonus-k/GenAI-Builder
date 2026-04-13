import { BaseProvider, getOpenAILikeModel } from '~/lib/modules/llm/base-provider';
import type { ModelInfo } from '~/lib/modules/llm/types';
import type { IProviderSetting } from '~/types/model';
import type { LanguageModelV1 } from 'ai';
import { createScopedLogger } from '~/utils/logger';

const logger = createScopedLogger('OpenAILike');

export default class OpenAILikeProvider extends BaseProvider {
  name = 'OpenAILike';
  getApiKeyLink = undefined;

  config = {
    baseUrlKey: 'OPENAI_LIKE_API_BASE_URL',
    apiTokenKey: 'OPENAI_LIKE_API_KEY',
    modelsKey: 'OPENAI_LIKE_API_MODELS',
  };

  staticModels: ModelInfo[] = [];

  async getDynamicModels(
    apiKeys?: Record<string, string>,
    settings?: IProviderSetting,
    serverEnv: Record<string, string | undefined> = {},
  ): Promise<ModelInfo[]> {
    const { baseUrl, apiKey } = this.getProviderBaseUrlAndKey({
      apiKeys,
      providerSettings: settings,
      serverEnv,
      defaultBaseUrlKey: 'OPENAI_LIKE_API_BASE_URL',
      defaultApiTokenKey: 'OPENAI_LIKE_API_KEY',
    });

    if (!baseUrl || !apiKey) {
      return [];
    }

    try {
      const response = await fetch(`${baseUrl}/models`, {
        headers: {
          Authorization: `Bearer ${apiKey}`,
        },
        signal: this.createTimeoutSignal(5000),
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const res = (await response.json()) as { data: Array<{ id: string }> };

      return res.data.map((model) => ({
        name: model.id,
        label: this._generateModelLabel(model.id),
        provider: this.name,
        maxTokenAllowed: 8192,
        supportsTools: this._checkToolSupport(model.id),
      }));
    } catch (error) {
      logger.debug(`${this.name}: Not allowed to GET /models endpoint for provider`, error);

      // Fallback to OPENAI_LIKE_API_MODELS if available
      // eslint-disable-next-line dot-notation
      const modelsEnv = serverEnv['OPENAI_LIKE_API_MODELS'] || settings?.OPENAI_LIKE_API_MODELS;

      if (modelsEnv) {
        logger.debug(`${this.name}: OPENAI_LIKE_API_MODELS=${modelsEnv}`);
        return this._parseModelsFromEnv(modelsEnv);
      }

      return [];
    }
  }

  /**
   * Parse OPENAI_LIKE_API_MODELS environment variable
   * Format: path/to/model1:limit;path/to/model2:limit;path/to/model3:limit
   */
  private _parseModelsFromEnv(modelsEnv: string): ModelInfo[] {
    if (!modelsEnv) {
      return [];
    }

    try {
      const models: ModelInfo[] = [];
      const modelEntries = modelsEnv.split(';');

      for (const entry of modelEntries) {
        const trimmedEntry = entry.trim();

        if (!trimmedEntry) {
          continue;
        }

        const [modelPath, limitStr] = trimmedEntry.split(':');

        if (!modelPath) {
          continue;
        }

        const limit = limitStr ? parseInt(limitStr.trim(), 10) : 8192;
        const modelName = modelPath.trim();

        // Generate a readable label from the model path
        const label = this._generateModelLabel(modelName);

        models.push({
          name: modelName,
          label,
          provider: this.name,
          maxTokenAllowed: limit,
          supportsTools: this._checkToolSupport(modelName),
        });
      }

      logger.debug(`${this.name}: Parsed Models:`, models);

      return models;
    } catch (error) {
      logger.error(`${this.name}: Error parsing OPENAI_LIKE_API_MODELS:`, error);
      return [];
    }
  }

  /**
   * Generate a readable label from model path
   */
  private _generateModelLabel(modelPath: string): string {
    // Extract the last part of the path and clean it up
    const parts = modelPath.split('/');
    const lastPart = parts[parts.length - 1];

    // Remove common prefixes and clean up the name
    let label = lastPart
      .replace(/^accounts\//, '')
      .replace(/^fireworks\/models\//, '')
      .replace(/^models\//, '')
      .replace(/^v1\//, '')
      // Capitalize first letter of each word
      .replace(/\b\w/g, (l) => l.toUpperCase())
      // Replace underscores/hyphens with spaces for a cleaner look
      .replace(/[_-]+/g, ' ');

    // Add provider suffix if not already present
    if (
      !label.toLowerCase().includes('fireworks') &&
      !label.toLowerCase().includes('openai') &&
      !label.toLowerCase().includes('nvidia')
    ) {
      label += ' (OpenAI Compatible)';
    }

    return label;
  }

  /**
   * Check if a model supports tool-calling based on its ID/name.
   * Standardizes support for known models that lack function-calling on certain providers.
   */
  private _checkToolSupport(modelId: string): boolean {
    const lowercaseId = modelId.toLowerCase();

    // Known models that don't support tools on NVIDIA NIM / OpenAILike
    const unsupportedPatterns = [
      /yi-large/i,
      /fuyu-8b/i,
      /jamba/i,
      /starcoder/i,
      /nemotron-.*-instruct/i, // Some Nemotron models are chat-only
    ];

    if (unsupportedPatterns.some((pattern) => pattern.test(lowercaseId))) {
      logger.debug(`Model ${modelId} detected as non-tool compatible`);
      return false;
    }

    return true;
  }

  getModelInstance(options: {
    model: string;
    serverEnv: Env;
    apiKeys?: Record<string, string>;
    providerSettings?: Record<string, IProviderSetting>;
  }): LanguageModelV1 {
    const { model, serverEnv, apiKeys, providerSettings } = options;

    const { baseUrl, apiKey } = this.getProviderBaseUrlAndKey({
      apiKeys,
      providerSettings: providerSettings?.[this.name],
      serverEnv,
      defaultBaseUrlKey: 'OPENAI_LIKE_API_BASE_URL',
      defaultApiTokenKey: 'OPENAI_LIKE_API_KEY',
    });

    if (!baseUrl || !apiKey) {
      throw new Error(`Missing configuration for ${this.name} provider`);
    }

    return getOpenAILikeModel(baseUrl, apiKey, model);
  }
}
