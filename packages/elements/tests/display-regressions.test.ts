import { afterEach, describe, expect, it, vi } from 'vitest';
import { RgRadioElement } from '../src/index.js';
import type { RgAvatarElement, RgTextareaElement } from '../src/index.js';
import '../src/register.js';

afterEach(() => {
  document.body.replaceChildren();
  vi.unstubAllGlobals();
});

describe('display regressions', () => {
  it('keeps the keyboard focus ring visible on a checked radio', () => {
    const styles = RgRadioElement.styles;
    const checkedStateIndex = styles.lastIndexOf(':host([checked]) .indicator');
    const focusVisibleIndex = styles.lastIndexOf('.native:focus-visible + .indicator');

    expect(checkedStateIndex).toBeGreaterThan(-1);
    expect(focusVisibleIndex).toBeGreaterThan(checkedStateIndex);
  });

  it('keeps the avatar fallback visible until the current source loads', () => {
    const avatar = document.createElement('rg-avatar') as RgAvatarElement;
    avatar.name = 'Reglow User';
    avatar.src = '/avatars/first.png';
    const load = vi.fn();
    const error = vi.fn();
    avatar.addEventListener('rg-load', load);
    avatar.addEventListener('rg-error', error);
    document.body.append(avatar);

    const fallback = avatar.shadowRoot!.querySelector<HTMLElement>('.fallback')!;
    const firstImage = avatar.shadowRoot!.querySelector<HTMLImageElement>('.image')!;

    expect(firstImage.hidden).toBe(true);
    expect(fallback.hidden).toBe(false);

    avatar.src = '/avatars/second.png';
    const secondImage = avatar.shadowRoot!.querySelector<HTMLImageElement>('.image')!;

    firstImage.dispatchEvent(new Event('load'));
    expect(secondImage.hidden).toBe(true);
    expect(fallback.hidden).toBe(false);
    expect(load).not.toHaveBeenCalled();

    firstImage.dispatchEvent(new Event('error'));
    expect(secondImage.hidden).toBe(true);
    expect(fallback.hidden).toBe(false);
    expect(error).not.toHaveBeenCalled();

    secondImage.dispatchEvent(new Event('load'));

    expect(secondImage.hidden).toBe(false);
    expect(fallback.hidden).toBe(true);
    expect(load).toHaveBeenCalledOnce();
    expect((load.mock.calls[0]![0] as CustomEvent).detail.src).toBe('/avatars/second.png');
  });

  it('recalculates auto-grow height when the textarea width changes and disconnects', () => {
    class ResizeObserverMock {
      static instances: ResizeObserverMock[] = [];

      readonly observe = vi.fn();
      readonly unobserve = vi.fn();
      readonly disconnect = vi.fn();

      constructor(readonly callback: ResizeObserverCallback) {
        ResizeObserverMock.instances.push(this);
      }

      trigger(): void {
        this.callback([], this as unknown as ResizeObserver);
      }
    }

    vi.stubGlobal('ResizeObserver', ResizeObserverMock);

    const textarea = document.createElement('rg-textarea') as RgTextareaElement;
    textarea.autoGrow = true;
    document.body.append(textarea);

    const control = textarea.shadowRoot!.querySelector<HTMLTextAreaElement>('.control')!;
    const controlWrap = textarea.shadowRoot!.querySelector<HTMLElement>('.control-wrap')!;
    const observer = ResizeObserverMock.instances[0]!;
    let width = 320;
    let scrollHeight = 120;

    vi.spyOn(control, 'getBoundingClientRect').mockImplementation(
      () =>
        ({
          bottom: 0,
          height: 0,
          left: 0,
          right: width,
          top: 0,
          width,
          x: 0,
          y: 0,
          toJSON: () => ({}),
        }) as DOMRect,
    );
    Object.defineProperty(control, 'scrollHeight', {
      configurable: true,
      get: () => scrollHeight,
    });

    observer.trigger();
    expect(control.style.height).toBe('120px');

    width = 240;
    scrollHeight = 180;
    observer.trigger();

    expect(observer.observe).toHaveBeenCalledWith(controlWrap);
    expect(observer.observe).toHaveBeenCalledWith(control);
    expect(control.style.height).toBe('180px');

    textarea.remove();
    expect(observer.disconnect).toHaveBeenCalledOnce();
  });
});
