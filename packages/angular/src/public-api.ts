import { ReglowCheckedValueAccessor } from './lib/reglow-checked-value-accessor.js';
import { ReglowValueAccessor } from './lib/reglow-value-accessor.js';

export { ReglowCheckedValueAccessor, ReglowValueAccessor };

export const REGLOW_FORM_DIRECTIVES = [ReglowValueAccessor, ReglowCheckedValueAccessor] as const;
