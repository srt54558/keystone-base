/**
 * KEYSTONE MODULE REGISTRY
 * 
 * This registry tracks which modules are active in the application.
 * Modules register themselves during initialization or import.
 * This allows the application to adapt UI and logic based on available features.
 */

export type ModuleId = 'org-core' | 'polar-pay' | 'file-storage' | 'ai-obs' | string;

export interface ModuleConfig {
  id: ModuleId;
  name: string;
  version?: string;
}

class ModuleRegistry {
  private active = new Map<ModuleId, ModuleConfig>();

  /**
   * Register a module as active.
   * Typically called in the module's initialization file.
   */
  register(config: ModuleConfig) {
    if (this.active.has(config.id)) {
      console.warn(`Module "${config.id}" is already registered.`);
      return;
    }
    this.active.set(config.id, config);
  }

  /**
   * Check if a module is active.
   * Useful for conditional rendering or logic.
   */
  has(id: ModuleId): boolean {
    return this.active.has(id);
  }

  /**
   * Get configuration for a specific module.
   */
  get(id: ModuleId): ModuleConfig | undefined {
    return this.active.get(id);
  }

  /**
   * List all active module IDs.
   */
  list(): ModuleId[] {
    return Array.from(this.active.keys());
  }
}

// Export a singleton instance
export const modules = new ModuleRegistry();
