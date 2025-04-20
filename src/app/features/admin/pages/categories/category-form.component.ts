import { Component, OnInit, Input, Output, EventEmitter, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Category } from '../../../products/models/category.model'; // La ruta a products/models sigue siendo la misma

@Component({
  selector: 'app-category-form',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './category-form.component.html',
  styleUrls: ['./category-form.component.scss']
})
export class CategoryFormComponent implements OnInit {
  @Input() category: Category | null = null;
  @Output() save = new EventEmitter<Partial<Category>>();

  private fb = inject(FormBuilder);
  categoryForm!: FormGroup;
  isEditMode = false;

  ngOnInit(): void {
    this.isEditMode = !!this.category;
    this.initForm();
    if (this.isEditMode && this.category) {
      this.categoryForm.patchValue(this.category);
    }
  }

  private initForm(): void {
    this.categoryForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]]
    });
  }

  onSubmit(): void {
    if (this.categoryForm.invalid) {
      this.categoryForm.markAllAsTouched();
      return;
    }
    this.save.emit(this.categoryForm.value as Partial<Category>);
  }

  get f() { return this.categoryForm.controls; }
} 