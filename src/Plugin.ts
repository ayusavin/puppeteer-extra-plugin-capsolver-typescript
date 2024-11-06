import { PuppeteerExtraPlugin } from 'puppeteer-extra-plugin';
import { Browser, Page } from 'puppeteer';
import { Solver } from 'capsolver-npm';

interface PluginOptions {
  apiKey: string | null;
  verbose: number;
}

interface SolverPage extends Page {
  solver: () => Solver;
  setSolver: (opts: PluginOptions) => Promise<void>;
}

class SolverPlugin extends PuppeteerExtraPlugin {
  private apiKey: string | null;
  private verbose: number;
  private solver!: Solver;

  constructor(apiKey: string | null = null, verbose: number = 0) {
    super({ apiKey, verbose });
    this.apiKey = apiKey;
    this.verbose = verbose;
  }

  get name(): string {
    return 'capsolver';
  }

  get defaults(): PluginOptions {
    return { apiKey: null, verbose: 0 };
  }

  async onPluginRegistered(): Promise<void> {
    this.solver = new Solver(this.apiKey, this.verbose);
  }

  async onBrowser(browser: Browser): Promise<void> {
    const pages = await browser.pages();

    for (const page of pages) {
      this._addSolverToPage(page as SolverPage);
    }
  }

  async onPageCreated(page: Page): Promise<void> {
    await page.setBypassCSP(true);
    this._addSolverToPage(page as SolverPage);
  }

  private _addSolverToPage(page: SolverPage): void {
    page.solver = (): Solver => this.solver;
    page.setSolver = async (opts: PluginOptions): Promise<void> => {
      this.solver = new Solver(opts.apiKey, opts.verbose);
    };
  }
}

const defaultExport = (apiKey: string | null, verbose: number): SolverPlugin => 
  new SolverPlugin(apiKey, verbose);

export default defaultExport; 