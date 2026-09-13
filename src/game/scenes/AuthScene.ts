import Phaser from 'phaser';
import { getCurrentUser, signIn, signUp } from '../../services/auth';
import { isSupabaseConfigured } from '../../services/supabase';

/**
 * AuthScene shows a simple HTML form overlay for register / sign-in.
 * Phaser owns the flow; the form is plain HTML (no React).
 */
export class AuthScene extends Phaser.Scene {
  private mode: 'signin' | 'register' = 'signin';
  private overlay: HTMLElement | null = null;
  private form: HTMLFormElement | null = null;
  private title: HTMLElement | null = null;
  private submitButton: HTMLButtonElement | null = null;
  private toggleButton: HTMLButtonElement | null = null;
  private usernameField: HTMLElement | null = null;
  private errorEl: HTMLElement | null = null;
  private emailInput: HTMLInputElement | null = null;
  private passwordInput: HTMLInputElement | null = null;
  private usernameInput: HTMLInputElement | null = null;

  constructor() {
    super('AuthScene');
  }

  create(): void {
    this.add
      .text(this.scale.width / 2, 48, 'Sign in to save your progress', {
        fontFamily: 'Segoe UI, sans-serif',
        fontSize: '22px',
        color: '#f4f7fb',
      })
      .setOrigin(0.5);

    if (!isSupabaseConfigured()) {
      this.add
        .text(
          this.scale.width / 2,
          this.scale.height / 2,
          [
            'Supabase is not configured yet.',
            '',
            '1. Create a Supabase project',
            '2. Copy .env.example → .env',
            '3. Paste your URL and anon key',
            '4. Run the SQL migration',
            '5. Restart npm run dev',
          ].join('\n'),
          {
            fontFamily: 'Segoe UI, sans-serif',
            fontSize: '16px',
            color: '#ffb4b4',
            align: 'center',
            lineSpacing: 6,
          },
        )
        .setOrigin(0.5);
      return;
    }

    this.bindOverlay();
    this.showOverlay();
    this.syncFormMode();

    void getCurrentUser().then((user) => {
      if (user) {
        this.hideOverlay();
        this.scene.start('MenuScene');
      }
    });
  }

  shutdown(): void {
    this.hideOverlay();
    this.unbindOverlay();
  }

  private bindOverlay(): void {
    this.overlay = document.getElementById('auth-overlay');
    this.form = document.getElementById('auth-form') as HTMLFormElement | null;
    this.title = document.getElementById('auth-title');
    this.submitButton = document.getElementById('auth-submit') as HTMLButtonElement | null;
    this.toggleButton = document.getElementById('auth-toggle') as HTMLButtonElement | null;
    this.usernameField = document.getElementById('auth-username-field');
    this.errorEl = document.getElementById('auth-error');
    this.emailInput = document.getElementById('auth-email') as HTMLInputElement | null;
    this.passwordInput = document.getElementById('auth-password') as HTMLInputElement | null;
    this.usernameInput = document.getElementById('auth-username') as HTMLInputElement | null;

    this.form?.addEventListener('submit', this.onSubmit);
    this.toggleButton?.addEventListener('click', this.onToggleMode);
  }

  private unbindOverlay(): void {
    this.form?.removeEventListener('submit', this.onSubmit);
    this.toggleButton?.removeEventListener('click', this.onToggleMode);
  }

  private showOverlay(): void {
    this.overlay?.classList.remove('hidden');
  }

  private hideOverlay(): void {
    this.overlay?.classList.add('hidden');
    this.clearError();
  }

  private syncFormMode(): void {
    const isRegister = this.mode === 'register';
    if (this.title) {
      this.title.textContent = isRegister ? 'Create Account' : 'Sign In';
    }
    if (this.submitButton) {
      this.submitButton.textContent = isRegister ? 'Register' : 'Sign In';
    }
    if (this.toggleButton) {
      this.toggleButton.textContent = isRegister
        ? 'Already have an account? Sign in'
        : 'Need an account? Register';
    }
    if (this.usernameField) {
      this.usernameField.classList.toggle('hidden', !isRegister);
    }
    if (this.usernameInput) {
      this.usernameInput.required = isRegister;
    }
  }

  private onToggleMode = (): void => {
    this.mode = this.mode === 'signin' ? 'register' : 'signin';
    this.clearError();
    this.syncFormMode();
  };

  private onSubmit = (event: Event): void => {
    event.preventDefault();
    void this.handleSubmit();
  };

  private async handleSubmit(): Promise<void> {
    const email = this.emailInput?.value ?? '';
    const password = this.passwordInput?.value ?? '';
    const username = this.usernameInput?.value ?? '';

    if (this.submitButton) {
      this.submitButton.disabled = true;
    }

    const result =
      this.mode === 'register'
        ? await signUp(email, password, username)
        : await signIn(email, password);

    if (this.submitButton) {
      this.submitButton.disabled = false;
    }

    if (result.error) {
      this.showError(result.error);
      return;
    }

    if (!result.user) {
      this.showError(
        'Account created. If email confirmation is enabled in Supabase, confirm your email, then sign in.',
      );
      this.mode = 'signin';
      this.syncFormMode();
      return;
    }

    this.hideOverlay();
    this.scene.start('MenuScene');
  }

  private showError(message: string): void {
    if (!this.errorEl) {
      return;
    }
    this.errorEl.textContent = message;
    this.errorEl.classList.remove('hidden');
  }

  private clearError(): void {
    if (!this.errorEl) {
      return;
    }
    this.errorEl.textContent = '';
    this.errorEl.classList.add('hidden');
  }
}
