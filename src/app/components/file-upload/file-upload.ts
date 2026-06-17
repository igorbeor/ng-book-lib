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

  public buttonText = input<string>('Select File');
  public dragAndDropText = input<string>('Drag and drop files here or click to');

  public value = model<File[]>([]);
  public accept = computed(() => this.allowedTypes().join(','));

  public isDragOver = signal<boolean>(false);

  private matSnackBar = inject(MatSnackBar);

  onDragOver(event: DragEvent) {
    event.preventDefault();
    this.isDragOver.set(true);

    if (this.value().length > 0 && event.dataTransfer) {
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
  
    if (this.value().length > 0) return;

    const files = event.dataTransfer?.files;
    if (this.validateFiles(files)) {
      this.value.set(Array.from(files!));
    }
  }

  onFileChange(event: Event) {
    if (this.value().length > 0) return;

    const input = event.target as HTMLInputElement;
    const files = input.files;
    if (this.validateFiles(files)) {
      this.value.set(Array.from(files!));
    }
  }

  onRemoveFile(file: File) {
    const currentFiles = this.value();
    this.value.set(currentFiles.filter((f) => f !== file));
  }

  private validateFiles(files?: FileList | null): boolean {
    if (!files || files.length === 0) {
      this.openSnackBar('No files selected.');
      return false;
    }
    const notAllowedFileTypes = Array.from(files).filter(
      (file) => !this.allowedTypes().includes(file.type),
    );
    if (notAllowedFileTypes.length > 0) {
      this.openSnackBar(
        `File type not allowed: ${notAllowedFileTypes.map((file) => file.type).join(', ')}`,
      );
      return false;
    }
    return true;
  }

  private openSnackBar(message: string, action: string = 'Close', duration: number = 3000) {
    this.matSnackBar.open(message, action, { duration });
  }
}
