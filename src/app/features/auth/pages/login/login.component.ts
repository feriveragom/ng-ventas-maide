import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common'; // Para ngIf, ngClass
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms'; // Para Reactive Forms
import { Router, ActivatedRoute } from '@angular/router'; // Para redirigir después del login
import { take } from 'rxjs/operators';

import { AuthService } from '../../../../core/services/auth.service'; // Importar AuthService

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule], // Importar módulos necesarios
  templateUrl: './login.component.html',
  // styleUrl: '' // Eliminado completamente
})
export class LoginComponent implements OnInit {

  private fb = inject(FormBuilder);
  private router = inject(Router);
  private authService = inject(AuthService);
  private route = inject(ActivatedRoute); // Inyectar ActivatedRoute

  loginForm!: FormGroup;
  isLoading = false;
  errorMessage: string | null = null;

  ngOnInit(): void {
    // Comprobar si ya está autenticado al cargar el componente
    this.authService.isAuthenticated$.pipe(take(1)).subscribe(isAuthenticated => {
      if (isAuthenticated) {
        console.log('Usuario ya autenticado, redirigiendo desde login...');
        // Intentar redirigir a returnUrl o a /admin
        const returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/admin';
        this.router.navigateByUrl(returnUrl);
      }
    });

    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  // Getter para acceso fácil a los controles del form en el template
  get f() { return this.loginForm.controls; }

  async onSubmit(): Promise<void> {
    if (this.loginForm.invalid) {
      return;
    }

    this.isLoading = true;
    this.errorMessage = null;

    const email = this.loginForm.value.email;
    const password = this.loginForm.value.password;

    try {
      // Llamar al método de login del AuthService
      await this.authService.login(email, password);
      console.log('Login exitoso desde componente para:', email);
      // Redirigir a la página principal de admin (o la que prefieras)
      this.router.navigate(['/admin']); // Redirige a la raíz de admin

    } catch (error: any) {
      console.error('Error de login:', error);
      // Mapear errores comunes de Firebase Auth a mensajes amigables
      if (error.code === 'auth/invalid-credential' || error.code === 'auth/invalid-email' || error.code === 'auth/wrong-password') {
        this.errorMessage = 'Email o contraseña incorrectos.';
      } else if (error.code === 'auth/user-not-found') {
        this.errorMessage = 'No se encontró usuario con ese email.';
      } else {
        this.errorMessage = 'Ocurrió un error inesperado al iniciar sesión.';
      }
    } finally {
      this.isLoading = false;
    }
  }
} 