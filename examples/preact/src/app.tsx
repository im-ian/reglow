import { render } from 'preact';
import { useState } from 'preact/hooks';
import { defineElements, type RgPressDetail, type RgSelectOption } from '@reglow/elements';
import { RgButtonElement } from '@reglow/elements/components/button';
import { RgInputElement } from '@reglow/elements/components/input';
import { RgRatingElement } from '@reglow/elements/components/rating';
import { RgSelectElement } from '@reglow/elements/components/select';
import { RgSwitchElement } from '@reglow/elements/components/switch';
import '@reglow/preact';
import '@reglow/tokens/css';
import '@reglow/example-theme/demo.css';

defineElements([
  { tagName: RgButtonElement.tagName, constructor: RgButtonElement },
  { tagName: RgInputElement.tagName, constructor: RgInputElement },
  { tagName: RgRatingElement.tagName, constructor: RgRatingElement },
  { tagName: RgSelectElement.tagName, constructor: RgSelectElement },
  { tagName: RgSwitchElement.tagName, constructor: RgSwitchElement },
]);

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

function PreactLaunchRoom() {
  const [projectName, setProjectName] = useState(INITIAL_SETTINGS.projectName);
  const [region, setRegion] = useState(INITIAL_SETTINGS.region);
  const [isPrivate, setIsPrivate] = useState(INITIAL_SETTINGS.isPrivate);
  const [confidence, setConfidence] = useState(INITIAL_SETTINGS.confidence);
  const [launch, setLaunch] = useState<LaunchSettings>(INITIAL_SETTINGS);
  const [status, setStatus] = useState(
    'Atlas Field Notes is staged in the Seoul orbit. Adjust the draft, then save it.',
  );

  const saveLaunch = (event: CustomEvent<RgPressDetail>) => {
    const nextProjectName = projectName.trim() || 'Untitled Northstar';
    const nextLaunch = { projectName: nextProjectName, region, isPrivate, confidence };

    setProjectName(nextProjectName);
    setLaunch(nextLaunch);
    setStatus(
      `${nextProjectName} saved to ${REGION_LABELS.get(region)} with confidence ${confidence} of 5.`,
    );

    // The detail is fully typed by @reglow/preact. Referencing it here keeps the
    // integration visible without coupling the app to the button's inner DOM.
    if (event.detail.pressed === true) setStatus(`${nextProjectName} is armed and saved.`);
  };

  return (
    <div class="demo-shell">
      <header class="demo-topbar">
        <a class="brand-lockup" href="#launch-settings" aria-label="Reglow Northstar home">
          <span class="brand-mark" aria-hidden="true">
            R
          </span>
          <span>Reglow / Northstar</span>
        </a>
        <span class="framework-pill">Preact · typed raw elements</span>
      </header>

      <main class="demo-main">
        <section class="intro-copy" aria-labelledby="page-title">
          <p class="eyebrow">Launch systems / 04</p>
          <h1 id="page-title">Set the room. Start the orbit.</h1>
          <p>
            A live operations surface built with Preact and Reglow Custom Elements—no wrapper
            components between the product and the platform.
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

            <form class="form-stack" onSubmit={(event) => event.preventDefault()}>
              <rg-input
                label="Project name"
                description="This becomes the public room title."
                name="projectName"
                required
                value={projectName}
                onInput={(event) => setProjectName(event.currentTarget.value)}
              />

              <rg-select
                label="Launch region"
                description="Choose the closest active relay."
                name="region"
                required
                options={REGIONS}
                value={region}
                onInput={(event) => setRegion(event.currentTarget.value)}
              />

              <div class="field-pair">
                <rg-switch
                  label="Private launch room"
                  description="Invite-only until you publish."
                  name="private"
                  checked={isPrivate}
                  onInput={(event) => setIsPrivate(event.currentTarget.checked)}
                />

                <rg-rating
                  label="Launch confidence"
                  description="Rate operational readiness."
                  name="confidence"
                  value={confidence}
                  onInput={(event) => setConfidence(event.currentTarget.value)}
                />
              </div>

              <div class="action-row">
                <rg-button
                  type="button"
                  variant="solid"
                  tone="brand"
                  size="lg"
                  onrg-press={saveLaunch}
                >
                  Save launch room
                  <span slot="end" aria-hidden="true">
                    ↗
                  </span>
                </rg-button>
                <span>Changes stay local until saved.</span>
              </div>

              <p class="status-note" role="status" aria-live="polite">
                {status}
              </p>
            </form>
          </section>

          <aside class="preview-panel" aria-labelledby="preview-title">
            <div class="preview-orbit" aria-hidden="true">
              <span />
            </div>
            <article class="preview-card">
              <p class="preview-label" id="preview-title">
                Saved launch card
              </p>
              <h2 class="preview-value">{launch.projectName}</h2>
              <p class="preview-meta">
                {REGION_LABELS.get(launch.region)} · {launch.isPrivate ? 'Private' : 'Open room'}
              </p>

              <div class="metric-strip" aria-label="Saved launch metrics">
                <span>
                  <strong>{launch.confidence}/5</strong>
                  <small>confidence</small>
                </span>
                <span>
                  <strong>{launch.isPrivate ? '01' : '∞'}</strong>
                  <small>access mode</small>
                </span>
                <span>
                  <strong>{launch.region.toUpperCase()}</strong>
                  <small>relay</small>
                </span>
              </div>

              <p class="code-note">
                <code>{'<rg-button onrg-press={saveLaunch} />'}</code>
              </p>
            </article>
          </aside>
        </div>

        <p class="footer-note">
          Complex options travel as a property. Native input events keep Preact state in orbit.
        </p>
      </main>
    </div>
  );
}

render(<PreactLaunchRoom />, document.getElementById('app')!);
