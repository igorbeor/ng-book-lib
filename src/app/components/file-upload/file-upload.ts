import { Component, computed, inject, input, model, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-file-upload',
  imports: [MatButtonModule, MatIconModule, MatListModule],
  templateUrl: './file-upload.html',
  styleUrl: './file-upload.scss',
})
export class FileUpload {
  public allowedTypes = input.required<string[]>();

  public isInvalid = input<boolean>(false);
  public buttonText = input<string>('Select File');
  public dragAndDropText = input<string>('Drag and drop files here or click to');

  public value = model<File | null>(null);
  public accept = computed(() => this.allowedTypes().join(','));

  public isDragOver = signal<boolean>(false);

  private matSnackBar = inject(MatSnackBar);

  onDragOver(event: DragEvent) {
    event.preventDefault();
    this.isDragOver.set(true);

    if (this.value() && event.dataTransfer) {
      event.dataTransfer.dropEffect = 'none';
    }
  }

  onDragLeave(event: DragEvent) {
    event.preventDefault();
    this.isDragOver.set(false);
  }

  onDrop(event: DragEvent) {
    event.preventDefault();
    this.isDragOver.set(false);
  
    if (this.value()) return;

    const files = event.dataTransfer?.files;
    const file = files?.[0] ?? null;
    if (this.validateFiles(file)) {
      this.value.set(file);
    }
  }

  onFileChange(event: Event) {
    if (this.value()) return;

    const input = event.target as HTMLInputElement;
    const files = input.files;
    const file = files?.[0] ?? null;
    if (this.validateFiles(file)) {
      this.value.set(file);
    }
  }

  onRemoveFile() {
    this.value.set(null);
  }

  private validateFiles(file: File | null): boolean {
    if (!file) {
      this.openSnackBar('No files selected.');
      return false;
    }
    if (!this.allowedTypes().includes(file.type)) {
      this.openSnackBar(
        `File type not allowed: ${file.type}. Allowed types: ${this.allowedTypes().join(', ')}`,
      );
      return false;
    }
    return true;
  }

  private openSnackBar(message: string, action: string = 'Close', duration: number = 3000) {
    this.matSnackBar.open(message, action, { duration });
  }
}
