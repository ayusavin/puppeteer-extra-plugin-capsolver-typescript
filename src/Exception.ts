interface ErrorDetails {
  id?: string;
  description?: string;
}

class CapSolverPluginException extends Error {
  public id: string | null;
  public description: string | null;

  constructor(message: string, error: ErrorDetails) {
    super(message);
    this.id = error.id ?? null;
    this.description = error.description ?? null;
  }
}

export { CapSolverPluginException }; 