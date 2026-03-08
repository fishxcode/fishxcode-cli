export type ConfigureContext = {
  apiKey: string;
  baseAnthropic: string;
  baseOpenAI: string;
  model?: string;
};

export type ConfigureResult = {
  file: string;
  hot: boolean;
};

export type ToolAdapter = {
  id: string;
  name: string;
  install: string;
  implemented: boolean;
  checkInstalled: () => boolean;
  isConfigured: () => boolean;
  configure: (ctx: ConfigureContext) => Promise<ConfigureResult>;
  reset: () => Promise<void>;
  getTargetFiles?: () => string[];
};
