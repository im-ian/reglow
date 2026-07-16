<script lang="ts">
  import '@reglow/tokens/css';
  import '@reglow/example-theme/demo.css';
  import { RgButton, RgInput, RgRating, RgSelect, RgSwitch } from '@reglow/svelte';

  const regionOptions = [
    { value: 'seoul', label: 'Seoul · ICN' },
    { value: 'london', label: 'London · LHR' },
    { value: 'new-york', label: 'New York · JFK' },
    { value: 'singapore', label: 'Singapore · SIN' },
  ] as const;

  type LaunchSnapshot = {
    name: string;
    region: string;
    isPrivate: boolean;
    readiness: number;
    revision: number;
  };

  let projectName = $state('Northstar Mobile');
  let region = $state('seoul');
  let isPrivate = $state(true);
  let readiness = $state(4);
  let status = $state('Draft 04 is ready for a final signal check.');
  let launch = $state<LaunchSnapshot>({
    name: 'Northstar Mobile',
    region: 'seoul',
    isPrivate: true,
    readiness: 4,
    revision: 4,
  });

  const previewRegion = $derived(
    regionOptions.find((option) => option.value === launch.region)?.label ?? 'Unassigned region',
  );
  const readinessLabel = $derived(`${launch.readiness}/5 signal confidence`);

  function queueLaunch(): void {
    const normalizedName = projectName.trim() || 'Untitled launch';
    projectName = normalizedName;
    launch = {
      name: normalizedName,
      region,
      isPrivate,
      readiness,
      revision: launch.revision + 1,
    };
    status = `${normalizedName} is queued for ${regionOptions.find((option) => option.value === region)?.label ?? region}.`;
  }
</script>

<div class="demo-shell">
  <header class="demo-topbar">
    <a class="brand-lockup" href="/" aria-label="Northstar Launch Room home">
      <span class="brand-mark" aria-hidden="true">N</span>
      <span>Northstar Launch Room</span>
    </a>
    <span class="framework-pill">Svelte 5 · Reglow</span>
  </header>

  <main class="demo-main">
    <header class="intro-copy">
      <p class="eyebrow">Launch protocol · 08</p>
      <h1>Give the next release<br />a <em>clean trajectory.</em></h1>
      <p>
        Tune the rollout signal, choose a launch region, and stage a release brief without leaving
        the room.
      </p>
    </header>

    <div class="demo-grid">
      <section class="control-panel" aria-labelledby="settings-heading">
        <div class="panel-heading">
          <div>
            <span>Release settings</span>
            <h2 id="settings-heading">Flight brief</h2>
          </div>
          <span>Draft {String(launch.revision).padStart(2, '0')}</span>
        </div>

        <div class="form-stack">
          <RgInput
            bind:value={projectName}
            label="Project name"
            description="Shown on the launch card and status feed."
            placeholder="Name this release"
            clearable
          />

          <RgSelect
            bind:value={region}
            options={regionOptions}
            label="Primary region"
            description="Complex option data is assigned as a live element property."
          />

          <div class="field-pair">
            <RgSwitch
              bind:checked={isPrivate}
              label="Private rollout"
              description="Invite-only until the signal clears."
            />
            <RgRating
              bind:value={readiness}
              label="Signal confidence"
              description="Rate operational readiness."
              max={5}
            />
          </div>

          <div class="action-row">
            <RgButton variant="solid" tone="brand" size="lg" onPress={queueLaunch}>
              Queue launch
            </RgButton>
            <span>↗ Brief updates on press</span>
          </div>

          <p class="status-note" role="status" aria-live="polite">{status}</p>
        </div>
      </section>

      <section class="preview-panel" aria-labelledby="preview-heading">
        <div class="preview-orbit" aria-hidden="true">
          <span></span>
          <span></span>
          <span></span>
        </div>

        <article class="preview-card">
          <p class="preview-label">
            Live output · NL–{String(launch.revision).padStart(2, '0')}
          </p>
          <h2 class="preview-value" id="preview-heading">{launch.name}</h2>
          <p class="preview-meta">
            <span>{previewRegion}</span>
            <span>{launch.isPrivate ? 'Private channel' : 'Public channel'}</span>
          </p>

          <div class="metric-strip" aria-label="Launch metrics">
            <div><span>Window</span><strong>09:40 KST</strong></div>
            <div>
              <span>Audience</span><strong>{launch.isPrivate ? 'Invited' : 'Everyone'}</strong>
            </div>
            <div>
              <span>Readiness</span><strong
                >{'●'.repeat(launch.readiness)}{'○'.repeat(5 - launch.readiness)}</strong
              >
            </div>
          </div>

          <p class="code-note">
            <code>bind:value · bind:checked · onPress</code>&nbsp; keeps {readinessLabel} in sync.
          </p>
        </article>
      </section>
    </div>
    <footer class="footer-note">
      <span>Reglow integration specimen</span>
      <span>Svelte components · typed callbacks · live bindings</span>
    </footer>
  </main>
</div>
