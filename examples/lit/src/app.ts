import { LitElement, html } from 'lit';
import type {
  RgInputElement,
  RgPressDetail,
  RgRatingElement,
  RgSelectElement,
  RgSelectOption,
  RgSwitchElement,
} from '@reglow/elements';
import '@reglow/elements/register';
import '@reglow/tokens/css';
import '@reglow/example-theme/demo.css';

const REGIONS = [
  { value: 'icn', label: 'Seoul · ICN edge' },
  { value: 'fra', label: 'Frankfurt · FRA core' },
  { value: 'pdx', label: 'Portland · PDX orbit' },
  { value: 'syd', label: 'Sydney · SYD relay' },
  { value: 'lhr', label: 'London · LHR archive', disabled: true },
] satisfies readonly RgSelectOption[];

const REGION_LABELS = new Map(REGIONS.map((region) => [region.value, region.label]));

interface LaunchSettings {
  readonly projectName: string;
  readonly region: string;
  readonly isPrivate: boolean;
  readonly confidence: number;
}

const INITIAL_SETTINGS: LaunchSettings = {
  projectName: 'Atlas Field Notes',
  region: 'icn',
  isPrivate: true,
  confidence: 4,
};

class NorthstarLaunchRoom extends LitElement {
  static properties = {
    projectName: { state: true },
    region: { state: true },
    isPrivate: { state: true },
    confidence: { state: true },
    launch: { state: true },
    status: { state: true },
  };

  declare projectName: string;
  declare region: string;
  declare isPrivate: boolean;
  declare confidence: number;
  declare launch: LaunchSettings;
  declare status: string;

  constructor() {
    super();
    this.projectName = INITIAL_SETTINGS.projectName;
    this.region = INITIAL_SETTINGS.region;
    this.isPrivate = INITIAL_SETTINGS.isPrivate;
    this.confidence = INITIAL_SETTINGS.confidence;
    this.launch = INITIAL_SETTINGS;
    this.status = 'Atlas Field Notes is staged in the Seoul orbit. Adjust the draft, then save it.';
  }

  protected createRenderRoot(): HTMLElement {
    return this;
  }

  private handleProjectName(event: Event) {
    this.projectName = (event.currentTarget as RgInputElement).value;
  }

  private handleRegion(event: Event) {
    this.region = (event.currentTarget as RgSelectElement).value;
  }

  private handlePrivacy(event: Event) {
    this.isPrivate = (event.currentTarget as RgSwitchElement).checked;
  }

  private handleConfidence(event: Event) {
    this.confidence = (event.currentTarget as RgRatingElement).value;
  }

  private saveLaunch(event: CustomEvent<RgPressDetail>) {
    const nextProjectName = this.projectName.trim() || 'Untitled Northstar';

    this.projectName = nextProjectName;
    this.launch = {
      projectName: nextProjectName,
      region: this.region,
      isPrivate: this.isPrivate,
      confidence: this.confidence,
    };
    this.status = `${nextProjectName} saved to ${REGION_LABELS.get(this.region)} with confidence ${this.confidence} of 5.`;

    if (event.detail.pressed === true) this.status = `${nextProjectName} is armed and saved.`;
  }

  protected render() {
    return html`
      <div class="demo-shell">
        <header class="demo-topbar">
          <a class="brand-lockup" href="#launch-settings" aria-label="Reglow Northstar home">
            <span class="brand-mark" aria-hidden="true">R</span>
            <span>Reglow / Northstar</span>
          </a>
          <span class="framework-pill">Lit · native template bindings</span>
        </header>

        <main class="demo-main">
          <section class="intro-copy" aria-labelledby="page-title">
            <p class="eyebrow">Launch systems / 04</p>
            <h1 id="page-title">Set the room. Start the orbit.</h1>
            <p>
              A live operations surface built with Lit and Reglow—property expressions move rich
              state straight into standards-based elements.
            </p>
          </section>

          <div class="demo-grid">
            <section class="control-panel" id="launch-settings" aria-labelledby="settings-title">
              <div class="panel-heading">
                <div>
                  <p class="eyebrow">01 / Configure</p>
                  <h2 id="settings-title">Launch settings</h2>
                </div>
                <span aria-hidden="true">NS—24</span>
              </div>

              <form class="form-stack" @submit=${(event: SubmitEvent) => event.preventDefault()}>
                <rg-input
                  label="Project name"
                  description="This becomes the public room title."
                  name="projectName"
                  required
                  .value=${this.projectName}
                  @input=${this.handleProjectName}
                ></rg-input>

                <rg-select
                  label="Launch region"
                  description="Choose the closest active relay."
                  name="region"
                  required
                  .options=${REGIONS}
                  .value=${this.region}
                  @input=${this.handleRegion}
                ></rg-select>

                <div class="field-pair">
                  <rg-switch
                    label="Private launch room"
                    description="Invite-only until you publish."
                    name="private"
                    .checked=${this.isPrivate}
                    @input=${this.handlePrivacy}
                  ></rg-switch>

                  <rg-rating
                    label="Launch confidence"
                    description="Rate operational readiness."
                    name="confidence"
                    .value=${this.confidence}
                    @input=${this.handleConfidence}
                  ></rg-rating>
                </div>

                <div class="action-row">
                  <rg-button
                    type="button"
                    variant="solid"
                    tone="brand"
                    size="lg"
                    @rg-press=${this.saveLaunch}
                  >
                    Save launch room
                    <span slot="end" aria-hidden="true">↗</span>
                  </rg-button>
                  <span>Changes stay local until saved.</span>
                </div>

                <p class="status-note" role="status" aria-live="polite">${this.status}</p>
              </form>
            </section>

            <aside class="preview-panel" aria-labelledby="preview-title">
              <div class="preview-orbit" aria-hidden="true"><span></span></div>
              <article class="preview-card">
                <p class="preview-label" id="preview-title">Saved launch card</p>
                <h2 class="preview-value">${this.launch.projectName}</h2>
                <p class="preview-meta">
                  ${REGION_LABELS.get(this.launch.region)} ·
                  ${this.launch.isPrivate ? 'Private' : 'Open room'}
                </p>

                <div class="metric-strip" aria-label="Saved launch metrics">
                  <span>
                    <strong>${this.launch.confidence}/5</strong>
                    <small>confidence</small>
                  </span>
                  <span>
                    <strong>${this.launch.isPrivate ? '01' : '∞'}</strong>
                    <small>access mode</small>
                  </span>
                  <span>
                    <strong>${this.launch.region.toUpperCase()}</strong>
                    <small>relay</small>
                  </span>
                </div>

                <p class="code-note"><code>.options=\${regions} · @rg-press=\${save}</code></p>
              </article>
            </aside>
          </div>

          <p class="footer-note">
            Dot-prefixed properties carry live state. Reglow events stay declarative in Lit.
          </p>
        </main>
      </div>
    `;
  }
}

customElements.define('northstar-launch-room', NorthstarLaunchRoom);
